import { Note } from "@/context/notes";
import { ActionIcon, Center, Group, Paper, Popover, Text, ThemeIcon, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import NoteCardMenu from "./NoteCardMenu";
import { IconUsersGroup, IconWorld } from "@tabler/icons-react";
import CopyField from "@/components/CopyField";


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
            className="cursor-pointer hover:brightness-105"
            onClick={handleCardClick}
        >
            <Group wrap="nowrap">
                <Title order={4} lineClamp={1} className="grow">
                    {note.title.trim().length > 0 ?
                        note.title :
                        "Untitled"
                    }
                </Title>
                <Group gap={"xs"} align="center" justify="center">
                    {note?.public &&
                        <div onClick={(e) => e.stopPropagation()}>
                            <Popover
                                width={220}
                                position="bottom"
                                withArrow
                                shadow="md">
                                <Popover.Target >
                                    <ActionIcon variant="default">
                                        <IconWorld size={16} />
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Center pb={"md"} pt={"xs"}>
                                        <ThemeIcon variant="transparent" c={"dimmed"} className="animate-pulse">
                                            <IconUsersGroup size={32} />
                                        </ThemeIcon>
                                    </Center>
                                    <Text size="xs" mb={"xs"}>This note is publicly accessible for reading with the following link</Text>
                                    <CopyField size="xs" c={"dimmed"} value={window.location.origin + "/note/" + note.id} />
                                </Popover.Dropdown>
                            </Popover>
                        </div>
                    }
                    <NoteCardMenu note={note} />
                </Group>
            </Group>
        </Paper >
    )
}

export default NoteCard