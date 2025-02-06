import { Note } from "@/context/notes";
import { useNotes } from "@/hooks/useNotes";
import { ActionIcon, Menu, Text } from "@mantine/core";
import {
    IconSettings,
    IconTrash,
    IconDotsVertical,
    IconArchive,
    IconPencil,
    IconArchiveOff
} from '@tabler/icons-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NoteCardMenu = ({
    note,
}: {
    note: Note,
}) => {
    const { deleteNote, toggleArchiveNote } = useNotes();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDeleteNote = async () => {
        setLoading(true);
        await deleteNote(note.id);
        setLoading(false);
    }

    const handleToggleArchiveNote = async () => {
        setLoading(true);
        await toggleArchiveNote(note);
        setLoading(false);
    }

    const handleOpenNote = () => {
        navigate(`/note/${note.id}`);
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    c={"dimmed"}
                    variant="default"
                    loading={loading}
                >
                    <IconDotsVertical />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                <Menu.Label><Text size="xs" w={"100%"}>{new Date(note.updated_at).toLocaleString()}</Text></Menu.Label>
                <Menu.Item
                    leftSection={<IconSettings size={14} />}
                    onClick={handleOpenNote}
                >
                    Open
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconPencil size={14} />}
                    onClick={() => alert("not implemented")}
                >
                    Customize
                </Menu.Item>
                <Menu.Item
                    leftSection={note.archived ? <IconArchiveOff size={14} /> : <IconArchive size={14} />}
                    onClick={handleToggleArchiveNote}
                >
                    {note.archived ? "Unarchive" : "Archive"}
                </Menu.Item>

                <Menu.Divider />
                <Menu.Item
                    color="red"
                    onClick={handleDeleteNote}
                    leftSection={<IconTrash size={14} />}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default NoteCardMenu