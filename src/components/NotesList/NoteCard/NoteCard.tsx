import { Note } from "@/context/notes";
import { Group, Paper, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import NoteCardMenu from "./NoteCardMenu";


const NoteCard = ({
    note,
}: {
    note: Note
}) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate("/note/" + note.id);
    }

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