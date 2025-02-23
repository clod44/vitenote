import { createContext } from "react";

export interface Folder {
    id: number;
    user_id: string;
    title: string;
    color: string;
    created_at: string;
}

export interface FoldersContextType {
    folders: Folder[];
    selectedFolder: Folder | null;
    selectFolder: (id: number) => void;
    createFolder: () => Promise<string | null>;
    updateFolder: (folderPartial: Partial<Folder> & { id: number }) => Promise<void>;
    deleteFolder: (id: number) => Promise<void>;
    isLoading: boolean;
}
export const FoldersContext = createContext<FoldersContextType | undefined>(undefined);
