import React, { useState, useEffect, useCallback } from 'react';
import supabase from '@/utils/supabase';
import { NotesContext, NotesContextType, Note, FollowedNote } from './NotesContext';
import { RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useFolders } from '@/hooks/useFolders';
//TODO:cast proper types to stuff

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [followedNotes, setFollowedNotes] = useState<FollowedNote[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showTrashed, setShowTrashed] = useState<boolean>(false);
    const [showFollowed, setShowFollowed] = useState<boolean>(false);
    const { selectedFolder } = useFolders();
    useEffect(() => {
        console.log("follwoedNotesChanged", followedNotes)
    }, [followedNotes])
    const fetchFollowedNotes = async () => {
        try {
            const { data, error } = await supabase
                .from('notes_follows')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            console.log("fetched followed notes", data);
            setFollowedNotes(data);
        } catch (error) {
            console.error('Error fetching followed notes:', error);
            setFollowedNotes([]);
        }
    }
    const fetchNotes = async () => {
        setIsLoading(true);
        console.log("fetching all notes");
        const query = async () => {
            if (showFollowed) {
                const { data, error } = await supabase
                    .from('notes_follows')
                    .select('notes(*)')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                return data?.map(item => item.notes);
            }
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user?.id)
                .eq('trashed', showTrashed)
                .order('updated_at', { ascending: false });
            if (error) throw error;
            return data;
        };

        try {
            const data = await query();
            if (showFollowed) console.log("WWWWWWWW", data);
            const sortedNotes = data?.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return 0;
            });
            setNotes(sortedNotes || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setNotes([]);
        } finally {
            setIsLoading(false);
        }
    };


    const payloadCallback = useCallback((payload: RealtimePostgresChangesPayload<Note | FollowedNote>) => {
        applyServerChanges(payload);
    }, [followedNotes]);
    useEffect(() => {
        const notesSubscription = supabase.channel('notes-all-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user?.id}` },
                (payload: RealtimePostgresChangesPayload<Note>) => {
                    console.log('Change received!', payload)
                    payloadCallback(payload);
                }
            )
            .subscribe()
        const followedNotesSubscription = supabase.channel('followed-notes-all-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notes_follows', filter: `user_id=eq.${user?.id}` },
                (payload: RealtimePostgresChangesPayload<Note>) => {
                    console.log('Change received!', payload)
                    payloadCallback(payload);
                }
            )
            .subscribe()

        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) fetchNotes();

        })
        return () => {
            supabase.removeChannel(notesSubscription);
            supabase.removeChannel(followedNotesSubscription)
            authSubscription.unsubscribe()
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (showFollowed) fetchFollowedNotes();
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTrashed, showFollowed]); //this will also run when mounted.


    const applyServerChanges = (payload: RealtimePostgresChangesPayload<Note | FollowedNote>) => {
        const { eventType } = payload;
        switch (eventType) {
            case 'INSERT':
                applyServerChangesInsert(payload as RealtimePostgresInsertPayload<Note | FollowedNote>);
                break;
            case 'UPDATE':
                applyServerChangesUpdate(payload as RealtimePostgresUpdatePayload<Note | FollowedNote>);
                break;
            case 'DELETE':
                applyServerChangesDelete(payload as RealtimePostgresDeletePayload<Note | FollowedNote>);
                break;
            default:
                console.error('Unknown payload event type:', eventType);
                break;
        }
    };

    const applyServerChangesInsert = (payload: RealtimePostgresInsertPayload<Note | FollowedNote>) => {
        const { new: newData, table } = payload;
        switch (table) {
            case "notes": {
                const newNote = newData as Note;
                setNotes((prevNotes) => [...prevNotes, newNote]);
                break;
            }
            case "notes_follows": {
                const newFollowedNote = newData as FollowedNote;
                setFollowedNotes((prevFollowedNotes) => [...prevFollowedNotes, newFollowedNote]);
                break;
            }
            default:
                break;
        }
    };

    const applyServerChangesUpdate = (payload: RealtimePostgresUpdatePayload<Note | FollowedNote>) => {
        const { new: newData, table } = payload;
        switch (table) {
            case "notes": {
                const newNote = newData as Note;
                setNotes((prevNotes) =>
                    prevNotes
                        .map((note) => (note.id === newNote.id ? newNote : note))
                    //let ui handle immediate archive/trashed note disappearing. see function filterNotes
                    //.filter((note) => note.trashed === showTrashed) 
                );
                break;
            }
            case "notes_follows": {
                const newFollowedNote = newData as FollowedNote;
                setFollowedNotes((prevFollowedNotes) =>
                    prevFollowedNotes
                        .map((followedNote) => (followedNote.id === newFollowedNote.id ? newFollowedNote : followedNote))
                )
                break;
            }
            default:
                break;
        }
    };
    const applyServerChangesDelete = (payload: RealtimePostgresDeletePayload<Note | FollowedNote>) => {
        const { old: oldData, table } = payload;
        switch (table) {
            case "notes": {
                setNotes((prevNotes) => prevNotes.filter((note) => note.id !== oldData?.id));
                break;
            }
            case "notes_follows": {
                console.log("1- followed note deleted", followedNotes, oldData);
                if (showFollowed) {
                    setFollowedNotes((prevFollowedNotes) => {
                        console.log("Prev followedNotes:", prevFollowedNotes);
                        const followedNote = prevFollowedNotes.find((f) => f.id === oldData?.id);
                        if (!followedNote) return prevFollowedNotes;

                        // Ensure setNotes uses a functional update
                        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== followedNote.note_id));

                        return prevFollowedNotes.filter((f) => f.id !== oldData?.id);
                    });
                }
                console.log("2- followed note deleted", followedNotes, oldData);
                break;
            }
            default:
                break;
        }
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

    /**
     * Creates a new note. associates the folder if selected.
     * @returns The id of the newly created note
     * @throws An error if the user is not logged in or if the note could not be created
     */
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
                folder_id: selectedFolder?.id || null
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
            if (updateData.folder_id === -1) updateData.folder_id = null;

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


    const followNote = async (id: number) => {
        if (!user) throw new Error('User not logged in');
        try {
            const { data, error } = await supabase.from('notes_follows').insert({
                user_id: user.id,
                note_id: id
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error following note:', error);
            throw error;
        }
    }

    const unfollowNote = async (id: number) => {
        if (!user) throw new Error('User not logged in');
        try {
            const { data, error } = await supabase.from('notes_follows').delete().eq('user_id', user.id).eq('note_id', id);
            if (error) throw error;
            //realtime changes do not track note-follows
            //setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
            return data;
        } catch (error) {
            console.error('Error unfollowing note:', error);
            throw error;
        }
    }

    const isFollowingNote: NotesContextType['isFollowingNote'] = async (id) => {
        if (!user) throw new Error('User not logged in');
        try {
            const { data, error } = await supabase
                .from('notes_follows')
                .select('*')
                .eq('user_id', user.id)
                .eq('note_id', id);

            if (error) throw error;
            return data?.[0] || null;
        } catch (error) {
            console.error('Error checking if following:', error);
            return false;
        }
    }

    const toggleFollowNote: NotesContextType['toggleFollowNote'] = async (id) => {
        if (!user) throw new Error('User not logged in');
        try {
            const isFollowing = await isFollowingNote(id);
            if (isFollowing) {
                await unfollowNote(id);
            } else {
                await followNote(id);
            }
        } catch (error) {
            console.error('Error following operation on note:', error);
            throw error;
        }
    };

    /**
     * Filters the notes based on the given keyword and archived state.
     * @param keyword the keyword to search for in the note titles. If empty, no filtering is done.
     * @param archived whether to filter notes by archived state or not. If true, only archived notes are returned.
     * @returns the filtered notes
     * should be used to access notes instead. allows instant ui feedback.
     */

    const filterNotes: NotesContextType['filterNotes'] = (keyword = "", archived = false) => {
        if (!notes) return [];
        const filterByTrashed = (n: Note[]) => n.filter(note => note.trashed === showTrashed);
        const filterByArchived = (n: Note[]) => n.filter(note => note.archived === archived);
        const filterByKeyword = (n: Note[]) => n.filter(note => note.title.toLowerCase().includes(keyword.toLowerCase()));
        const filterByFolder = (n: Note[]) => n.filter(note => note.folder_id === selectedFolder?.id);

        let result = notes;
        if (!showFollowed) {
            result = filterByTrashed(result);
            result = showTrashed ? result : filterByArchived(result);
            result = !selectedFolder ? result : filterByFolder(result);
        }
        result = keyword.length === 0 ? result : filterByKeyword(result);
        console.log(result)
        return result || [];
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
            showFollowed,
            setShowFollowed,
            toggleFollowNote,
            isFollowingNote,
            isLoading,
            getNote
        }}>
            {children}
        </NotesContext.Provider>
    );
};