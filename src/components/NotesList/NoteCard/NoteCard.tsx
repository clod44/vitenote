import { Note } from "@/context/notes";
import { Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import NoteCardMenu from "./NoteCardMenu";


const NoteCard = ({ note }: { note: Note }) => {
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
            <Group justify="space-between">
                <Stack gap={"xs"} h={"100%"} className="grow">
                    <Title order={4}>
                        {note.title.trim().length > 0 ?
                            note.title :
                            "Untitled"
                        }
                    </Title>
                    {note.content.trim().length > 0 &&
                        <Text size="sm" lineClamp={2}>{note.content}</Text>
                    }
                </Stack>
                <NoteCardMenu note={note} />
            </Group>
        </Paper>
    )
}

export default NoteCard