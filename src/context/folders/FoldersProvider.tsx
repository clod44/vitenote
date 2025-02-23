import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { FoldersContext, FoldersContextType, Folder } from './FoldersContext';
import { useAuth } from '@/hooks/useAuth';
import { RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

export const FoldersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchFolders = async () => {
        setIsLoading(true);
        console.log("fetching all folders")
        const { data, error } = await supabase.from('folders')
            .select('*')
            .order('title', { ascending: true });
        if (error) {
            console.error('Error fetching notes:', error.message);
            setFolders([]);
        } else {
            setFolders(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!user) return;
        const foldersSubscription = supabase.channel('folders-all-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'folders', filter: `user_id=eq.${user?.id}` },
                (payload: RealtimePostgresChangesPayload<Folder>) => {
                    console.log('Change received!', payload)
                    applyServerChanges(payload);
                }
            )
            .subscribe(() => {
                //fetch folders after realtime subscription is done
                fetchFolders();
            })

        return () => {
            supabase.removeChannel(foldersSubscription);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    const applyServerChanges = (payload: RealtimePostgresChangesPayload<Folder>) => {
        const { eventType } = payload;
        switch (eventType) {
            case 'INSERT':
                applyServerChangesInsert(payload as RealtimePostgresInsertPayload<Folder>);
                break;
            case 'UPDATE':
                applyServerChangesUpdate(payload as RealtimePostgresUpdatePayload<Folder>);
                break;
            case 'DELETE':
                applyServerChangesDelete(payload as RealtimePostgresDeletePayload<Folder>);
                break;
            default:
                console.error('Unknown payload event type:', eventType);
                break;
        }
    };

    const applyServerChangesInsert = (payload: RealtimePostgresInsertPayload<Folder>) => {
        const { new: newFolder } = payload;
        setFolders((prevFolders) => [newFolder, ...prevFolders]);
    };

    const applyServerChangesUpdate = (payload: RealtimePostgresUpdatePayload<Folder>) => {
        const { new: newFolder } = payload;
        setFolders((prevFolders) =>
            prevFolders
                //TODO:check if directly putting the new data in the state [...folders, newFolder] would work without unnecessary rerenders.
                .map((folder) => (folder.id === newFolder.id ? newFolder : folder))
        );
    };

    const applyServerChangesDelete = (payload: RealtimePostgresDeletePayload<Folder>) => {
        const { old: oldFolder } = payload;
        setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== oldFolder.id));
    };

    const createFolder: FoldersContextType['createFolder'] = async () => {
        try {
            if (!user) throw new Error('User not logged in');
            const { data, error } = await supabase.from('folders').insert({
                user_id: user.id, //TODO:insert user_id to created folders with db functions
            }).select('id');
            console.log(data);
            if (error) throw error;
            return data[0]?.id;
        } catch (error) {
            console.error('Error creating folder:', error);
            throw error;
        }
    }


    const updateFolder: FoldersContextType['updateFolder'] = async (folderPartial) => {
        try {
            if (!user) throw new Error('User not logged in');
            console.log("updating folder", folderPartial);

            // Filter out undefined/null values
            const updateData = Object.fromEntries(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Object.entries(folderPartial).filter(([_, v]) => v !== undefined && v !== null)
            );
            if (typeof updateData.title === 'string' && updateData.title.trim().length === 0) {
                updateData.title = "Folder";
            }

            const { error } = await supabase
                .from('folders')
                .update(updateData)
                .eq('id', folderPartial.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating folder:', error);
            throw error;
        }
    };

    const deleteFolder: FoldersContextType['deleteFolder'] = async (id) => {
        try {
            if (!user) throw new Error('User not logged in');
            const { error } = await supabase.from('folders').delete().eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting folder:', error);
            throw error;
        }
    }

    const selectFolder: FoldersContextType['selectFolder'] = (id) => {
        const folder = folders.find(folder => folder.id === id);
        if (folder) {
            setSelectedFolder(folder);
        } else {
            setSelectedFolder(null);
        }
    };

    return (
        <FoldersContext.Provider value={{
            folders,
            selectedFolder,
            selectFolder,
            isLoading,
            createFolder,
            updateFolder,
            deleteFolder
        }}>
            {children}
        </FoldersContext.Provider>
    );
};