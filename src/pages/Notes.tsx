import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import NotesToolBar from "@/components/NotesToolBar";
import { Note } from "@/context/notes";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { notes, isLoading: notesLoading } = useNotes();
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [showArchived, setShowArchived] = useState(false);

    const handleSearch = (keyword: string = "") => {
        console.log("Keyword:", keyword, "Show Archived:", showArchived);
        console.log("Notes:", notes);

        if (!notes) return;

        const filteredByArchived = notes.filter(note => {
            console.log("Note Archived:", note.archived, "Show Archived:", showArchived);
            return note.archived === showArchived;
        });

        console.log("Filtered By Archived:", filteredByArchived);

        if (keyword.length === 0) {
            setFilteredNotes(filteredByArchived);
            return;
        }

        const filteredByKeyword = filteredByArchived.filter(note =>
            note.title.toLowerCase().includes(keyword.toLowerCase())
        );

        console.log("Final Filtered Notes:", filteredByKeyword);
        setFilteredNotes(filteredByKeyword);
    };

    useEffect(() => {
        handleSearch();
    }, [notesLoading, notes, userLoading, user]);

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <>
            <NotesToolBar handleSearch={handleSearch} showArchived={showArchived} setShowArchived={setShowArchived} />
            <NotesList notes={filteredNotes} notesLoading={notesLoading} />
            {user && !userLoading && !notesLoading && !showArchived && <CreateNoteFab />}
        </>
    )
}

export default Notes