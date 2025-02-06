import { IconPlus } from "@tabler/icons-react"
import Fab from "@/components/Fab"
import { useNotes } from "@/hooks/useNotes";
import { useState } from "react";



const CreateNoteFab = () => {
    const { createNote } = useNotes();
    const [loading, setLoading] = useState(false);
    const handleCreateNote = async () => {
        setLoading(true);
        await createNote();
        setLoading(false);
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