import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import NotesToolBar from "@/components/NotesToolBar"
import { useAuth } from "@/hooks/useAuth";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();

    return (
        <>
            <NotesToolBar />
            <NotesList />
            {user && !userLoading && <CreateNoteFab />}
        </>
    )
}

export default Notes