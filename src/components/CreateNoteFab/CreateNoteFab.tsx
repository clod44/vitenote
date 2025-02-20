import { IconPlus } from "@tabler/icons-react"
import Fab from "@/components/Fab"
import { useNotes } from "@/hooks/useNotes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const CreateNoteFab = () => {
    const { createNote } = useNotes();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleCreateNote = async () => {
        setLoading(true);
        const id = await createNote();
        setLoading(false);
        navigate(`/note/${id}`);
    };
    return (
        <Fab
            onClick={loading ? undefined : handleCreateNote}
        >
            <IconPlus className={loading ? "animate-spin animate-ease-in-out" : "animate-jump-in"} />
        </Fab>
    )

}

export default CreateNoteFab