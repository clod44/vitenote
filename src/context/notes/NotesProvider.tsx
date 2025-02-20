import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { NotesContext, NotesContextType, Note } from './NotesContext';
import { RealtimePostgresChangesPayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
//TODO:cast proper types to stuff

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showTrashed, setShowTrashed] = useState<boolean>(false);

    const fetchNotes = async () => {
        setIsLoading(true);
        console.log("fetching all notes")
        const { data, error } = await supabase.from('notes')
            .select('*')
            .eq('user_id', user?.id)
            .eq('trashed', showTrashed)
            //.order('pinned', { ascending: false }) //supabase does not support multiple orders this will be handled in client
            .order('updated_at', { ascending: false });
        if (error) {
            console.error('Error fetching notes:', error.message);
            setNotes([]);
        } else {
            const sortedNotes = data?.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return 0;
            });
            setNotes(sortedNotes || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        //fetchNotes();
        const notesSubscription = supabase.channel('notes-all-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user?.id}` },
                (payload: RealtimePostgresChangesPayload<Note>) => {
                    console.log('Change received!', payload)
                    applyServerChanges(payload);
                }
            )
            .subscribe()

        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) fetchNotes();
        })
        return () => {
            supabase.removeChannel(notesSubscription);
            authSubscription.unsubscribe()
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTrashed]); //this will also run when mounted.


    const applyServerChanges = (payload: RealtimePostgresChangesPayload<Note>) => {
        const { eventType } = payload;
        switch (eventType) {
            case 'INSERT':
                applyServerChangesInsert(payload as RealtimePostgresInsertPayload<Note>);
                break;
            case 'UPDATE':
                applyServerChangesUpdate(payload as RealtimePostgresUpdatePayload<Note>);
                break;
            case 'DELETE':
                applyServerChangesDelete(payload as RealtimePostgresChangesPayload<Note>);
                break;
            default:
                console.error('Unknown payload event type:', eventType);
                break;
        }
    };

    const applyServerChangesInsert = (payload: RealtimePostgresInsertPayload<Note>) => {
        const { new: newNote } = payload;
        setNotes((prevNotes) => [newNote, ...prevNotes]);
    };

    const applyServerChangesUpdate = (payload: RealtimePostgresUpdatePayload<Note>) => {
        const { new: newNote } = payload;
        setNotes((prevNotes) =>
            prevNotes
                .map((note) => (note.id === newNote.id ? newNote : note))
            //let ui handle immediate archive/trashed note disappearing. see SearchKeyword function in pages/Note.tsx
            //.filter((note) => note.trashed === showTrashed) 
        );
    };

    const applyServerChangesDelete = (payload: RealtimePostgresChangesPayload<Note>) => {
        const { old: oldNote } = payload as unknown as { old: { id: number } | null };
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== oldNote?.id));
    };

    /**
     * Retrieves a note from the database by id
     * @param id The id of the note to retrieve
     * @returns The retrieved note or null if not found
     * @throws An error if the note could not be retrieved
     * 
     * Unauthorized users / strangers can't access trashed notes even if notes are public
     * Authorized users should use getTrashedNotes()
     */
    const fetchNote = async (id: number) => {
        try {
            const { data, error } = await supabase.from('notes').select('*').eq('id', id).eq('trashed', false).single();
            if (error) throw error;
            return data || null;
        } catch (error) {
            console.error('Error fetching note:', error);
            throw error;
        }
    }

    /**
     * Retrieves a note from the local state or the database
     * @param id The id of the note to retrieve
     * @returns The retrieved note or null if not found
     * @throws An error if the note could not be retrieved
     */
    const getNote: NotesContextType['getNote'] = async (id) => {
        try {
            //try from local state
            const localNote = notes.find((note) => note.id == id) || null;
            if (localNote) return localNote;
            //try from db
            const dbNote = await fetchNote(id);
            return dbNote || null;
        } catch (error) {
            console.error('Error fetching note:', error);
            throw error;
        }
    }

    const createNote: NotesContextType['createNote'] = async () => {
        try {
            if (!user) throw new Error('User not logged in');
            const { data, error } = await supabase.from('notes').insert({
                /*
                TODO:consider workaround to not have to manually attach user_id to the newly created note
                while this is not necessary(db triggers overwrites this user_id with the auth user id),
                the data must contain the user_id right from the start in order for the client 
                to be able to read this record.
                if client can't read this record immediately, it can't return its id to the 
                calling function, and the client won't immediately know which note just got created.
                */
                user_id: user.id,
            }).select('id');
            console.log(data);
            if (error) throw error;
            return data[0]?.id;
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }


    /**
     * Updates a note in the database with the specified fields.
     * @param note - An object containing the fields to update and the ID of the note.
     * @throws Will throw an error if the user is not logged in or if the update operation fails.
     */
    const updateNote: NotesContextType['updateNote'] = async (notePartial) => {
        try {
            if (!user) throw new Error('User not logged in');
            console.log("updating note", notePartial);

            // Filter out undefined/null values
            const updateData = Object.fromEntries(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Object.entries(notePartial).filter(([_, v]) => v !== undefined && v !== null)
            );
            if (typeof updateData.title === 'string' && updateData.title.trim().length === 0) {
                updateData.title = "Untitled";
            }

            const { error } = await supabase
                .from('notes')
                .update(updateData)
                .eq('id', notePartial.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    };


    const toggleArchiveNote: NotesContextType['toggleArchiveNote'] = async (note) => {
        try {
            if (!user) throw new Error('User not logged in');
            const { error } = await supabase.from('notes').update({ archived: !note.archived }).eq('id', note.id);
            if (error) throw error;
        } catch (error) {
            console.error('Error archiving note:', error);
            throw error;
        }
    }

    const togglePinnedNote: NotesContextType['togglePinnedNote'] = async (note) => {
        try {
            if (!user) throw new Error('User not logged in');
            const { error } = await supabase.from('notes').update({ pinned: !note.pinned }).eq('id', note.id);
            if (error) throw error;
        } catch (error) {
            console.error('Error pinning note:', error);
            throw error;
        }
    }

    const deleteNote: NotesContextType['deleteNote'] = async (id) => {
        try {
            if (!user) throw new Error('User not logged in');
            const { error } = await supabase.from('notes').delete().eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }

    const toggleTrashNote: NotesContextType['toggleTrashNote'] = async (id, trashed) => {
        try {
            if (!user) throw new Error('User not logged in');
            const { error } = await supabase.from('notes').update({ trashed: trashed }).eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error('Error sending note to trash:', error);
            throw error;
        }
    }



    /**
     * Filters the notes based on the given keyword and archived state.
     * @param keyword the keyword to search for in the note titles. If empty, no filtering is done.
     * @param archived whether to filter notes by archived state or not. If true, only archived notes are returned.
     * @returns the filtered notes
     * should be used to access notes instead. allows instant ui feedback.
     */

    const filterNotes: NotesContextType['filterNotes'] = (keyword = "", archived = false) => {
        if (!notes) return [];
        const filteredByTrashed = notes.filter(note => note.trashed === showTrashed);
        //don't filter by "archived" if we are looking inside the trash bin
        const filteredByArchived = showTrashed ?
            filteredByTrashed :
            filteredByTrashed.filter(note => {
                return note.archived === archived;
            });
        //don't filter by keyword if no keyword is given
        const filteredByKeyword = keyword.length === 0 ?
            filteredByArchived :
            filteredByArchived.filter(note =>
                note.title.toLowerCase().includes(keyword.toLowerCase())
            );
        return filteredByKeyword || [];
    };

    return (
        <NotesContext.Provider value={{
            notes,
            createNote,
            updateNote,
            toggleArchiveNote,
            togglePinnedNote,
            toggleTrashNote,
            showTrashed,
            setShowTrashed,
            deleteNote,
            fetchNotes,
            filterNotes,
            isLoading,
            getNote
        }}>
            {children}
        </NotesContext.Provider>
    );
};