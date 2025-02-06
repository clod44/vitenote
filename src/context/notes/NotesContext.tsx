import { createContext } from "react";

export interface Note {
    id: number;
    user_id: string;
    title: string;
    content: string;
    color: string;
    archived: boolean;
    updated_at: string;
    created_at: string;
}

export interface NotesContextType {
    notes: Note[];
    createNote: () => Promise<string | null>;
    updateNote: (note: Note) => Promise<void>;
    toggleArchiveNote: (note: Note) => Promise<void>;
    deleteNote: (id: number) => Promise<void>;
    isLoading: boolean;
    showArchived: boolean;
    setShowArchived: (showArchived: boolean) => void;
}
export const NotesContext = createContext<NotesContextType | undefined>(undefined);
