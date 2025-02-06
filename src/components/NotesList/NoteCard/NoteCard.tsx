import { Note } from "@/context/notes";
import { Group, Paper, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import NoteCardMenu from "./NoteCardMenu";
import { useNotes } from "@/hooks/useNotes";


const NoteCard = ({ note }: { note: Note }) => {
    const navigate = useNavigate();
    const { showArchived } = useNotes();
    const handleCardClick = () => {
        navigate("/note/" + note.id);
    }


    //*remove* this card if its archived status changes
    if (!showArchived === note.archived) return null;

    return (
        <Paper
            withBorder
            shadow="md"
            radius="md"
            p="md"
            onClick={handleCardClick}
            className="cursor-pointer hover:brightness-105"
        >
            <Group justify="space-between" wrap="nowrap">
                <Title order={4} lineClamp={1}>
                    {note.title.trim().length > 0 ?
                        note.title :
                        "Untitled"
                    }
                </Title>
                <NoteCardMenu note={note} />
            </Group>
        </Paper>
    )
}

export default NoteCard