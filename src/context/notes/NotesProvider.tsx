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


    const fetchNotes = async () => {
        setIsLoading(true);
        console.log("fetching all notes")
        const { data, error } = await supabase.from('notes').select('*');
        if (error) {
            console.error('Error fetching notes:', error.message);
            setNotes([]);
        } else {
            setNotes(data || []);
        }
        setIsLoading(false);
    };


    useEffect(() => {

        fetchNotes();

        const notesSubscription = supabase.channel('notes-all-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notes' },
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
    }, []);

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
        setNotes((prevNotes) => [...prevNotes, newNote]);
    };

    const applyServerChangesUpdate = (payload: RealtimePostgresUpdatePayload<Note>) => {
        const { new: newNote } = payload;
        setNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === newNote.id ? newNote : note))
        );
    };

    const applyServerChangesDelete = (payload: RealtimePostgresChangesPayload<Note>) => {
        const { old: oldNote } = payload as unknown as { old: { id: number } | null };
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== oldNote?.id));
    };

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

    const updateNote: NotesContextType['updateNote'] = async (note) => {
        try {
            if (!user) throw new Error('User not logged in');
            const { error } = await supabase.from('notes').update({ title: note.title, content: note.content, color: note.color }).eq('id', note.id);
            if (error) throw error;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

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

    return (
        <NotesContext.Provider value={{ notes, createNote, updateNote, toggleArchiveNote, deleteNote, isLoading }}>
            {children}
        </NotesContext.Provider>
    );
};