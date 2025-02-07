import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import NotesToolBar from "@/components/NotesToolBar"
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { notes, isLoading: notesLoading } = useNotes();
    const [filteredNotes, setFilteredNotes] = useState(notes);
    const { showArchived } = useNotes();

    const handleSearchKeywordChange = (keyword: string) => {
        if (keyword.length === 0) return setFilteredNotes(notes);
        const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredNotes(filteredNotes);
    };

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notesLoading]);

    return (
        <>
            <NotesToolBar onSearchKeywordChange={handleSearchKeywordChange} />
            <NotesList notes={filteredNotes} notesLoading={notesLoading} />
            {user && !userLoading && !showArchived && <CreateNoteFab />}
        </>
    )
}

export default Notes