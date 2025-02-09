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
        if (!notes) return;
        const filteredByArchived = notes.filter(note => {
            return note.archived === showArchived;
        });
        if (keyword.length === 0) {
            setFilteredNotes(filteredByArchived);
            return;
        }
        const filteredByKeyword = filteredByArchived.filter(note =>
            note.title.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredNotes(filteredByKeyword);
    };

    useEffect(() => {
        if (userLoading || notesLoading) return;
        handleSearch();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [notesLoading, notes, userLoading, user]);


    return (
        <>
            <NotesToolBar handleSearch={handleSearch} showArchived={showArchived} setShowArchived={setShowArchived} />
            <NotesList notes={filteredNotes} notesLoading={notesLoading} />
            {user && !userLoading && !notesLoading && !showArchived && <CreateNoteFab />}
        </>
    )
}

export default Notes