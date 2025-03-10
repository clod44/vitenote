import { createContext } from "react";

//TODO: expand on using types instead of interfaces in Contexes
export interface Note {
    __type__: 'note';
    id: number;
    user_id: string;
    title: string;
    content: string;
    color: string;
    archived: boolean;
    pinned: boolean;
    public: boolean;
    updated_at: string;
    created_at: string;
    trashed: boolean;
    trashed_at: string | null;
    folder_id: number | null;
}

export interface FollowedNote {
    __type__: 'followedNote';
    id: number;
    user_id: string;
    note_id: number;
    created_at: string;
}
export interface NotesContextType {
    notes: Note[];
    createNote: () => Promise<string | null>;
    updateNote: (notePartial: Partial<Note> & { id: number }) => Promise<void>;
    toggleArchiveNote: (note: Note) => Promise<void>;
    togglePinnedNote: (note: Note) => Promise<void>;
    toggleTrashNote: (id: number, trashed: boolean) => Promise<void>;
    showTrashed: boolean;
    setShowTrashed: (trashed: boolean) => void;
    deleteNote: (id: number) => Promise<void>;
    fetchNotes: () => Promise<void>;
    filterNotes: (keyword?: string, archived?: boolean) => Note[];
    showFollowed: boolean;
    toggleFollowNote: (id: number) => Promise<void>;
    setShowFollowed: (followed: boolean) => void;
    isFollowingNote: (id: number) => Promise<boolean>;
    isLoading: boolean;
    getNote: (id: number) => Promise<Note | null>;
}
export const NotesContext = createContext<NotesContextType | undefined>(undefined);
