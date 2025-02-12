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
        navigate("/note/" + note.id, { viewTransition: true });
    }

    return (
        <Paper
            withBorder
            shadow="md"
            radius="md"
            className="cursor-pointer hover:brightness-105 relative overflow-hidden"
            onClick={handleCardClick}
        >
            <div className="absolute left-0 h-full w-1 " style={{
                backgroundColor: "var(--mantine-color-" + note.color + "-filled)"
            }} />
            <Group wrap="nowrap" p={"md"}>
                <Title order={4} lineClamp={1} className="grow">
                    {note.title.trim().length > 0 ?
                        note.title :
                        "Untitled"
                    }
                </Title>
                <Group gap={"xs"} align="center" justify="center" onClick={(e) => e.stopPropagation()}>
                    <ActionIcon.Group>

                        {note?.public &&
                            <Popover
                                width={220}
                                position="bottom"
                                withArrow
                                shadow="md">
                                <Popover.Target >
                                    <ActionIcon variant="default" c={"dimmed"}>
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
                        }
                        <NoteCardMenu note={note} />

                    </ActionIcon.Group>
                </Group>
            </Group>
        </Paper >
    )
}

export default NoteCard