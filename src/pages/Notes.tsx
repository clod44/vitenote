import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import { NotesTopBar } from "@/components/TopBars";
import PullToRefresh from "@/components/PullToRefresh";
import { Note } from "@/context/notes";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";
import { useFolders } from "@/hooks/useFolders";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { notes, isLoading: notesLoading, showTrashed, fetchNotes, filterNotes } = useNotes();
    const { selectedFolder } = useFolders();
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [showArchived, setShowArchived] = useState(false);

    const handleSearch = (keyword: string = "") => {
        const newNotes = filterNotes(keyword, showArchived);
        setFilteredNotes(newNotes);
    };

    useEffect(() => {
        if (userLoading || notesLoading) return;
        handleSearch();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [notesLoading, notes, userLoading, user, selectedFolder]);

    return (
        <>
            <NotesTopBar
                handleSearch={handleSearch}
                showArchived={showArchived}
                setShowArchived={setShowArchived}
            />
            <PullToRefresh onRefresh={fetchNotes} />
            <NotesList notes={filteredNotes} notesLoading={notesLoading} />
            {user && !userLoading && !notesLoading && !showArchived && !showTrashed && <CreateNoteFab />}
        </>
    )
}

export default Notes