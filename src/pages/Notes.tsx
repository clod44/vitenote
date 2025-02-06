import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import NotesToolBar from "@/components/NotesToolBar"
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { showArchived } = useNotes();

    return (
        <>
            <NotesToolBar />
            <NotesList />
            {user && !userLoading && !showArchived && <CreateNoteFab />}
        </>
    )
}

export default Notes