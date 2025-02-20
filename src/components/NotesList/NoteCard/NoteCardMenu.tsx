import NoteSettings, { NoteSettingsRef } from "@/components/NoteSettings";
import { Note } from "@/context/notes";
import { useNotes } from "@/hooks/useNotes";
import { ActionIcon, Menu, Text } from "@mantine/core";
import {
    IconSettings,
    IconTrash,
    IconDotsVertical,
    IconArchive,
    IconPencil,
    IconArchiveOff,
    IconPinned,
    IconPinnedFilled,
    IconRestore,
    IconBomb
} from '@tabler/icons-react';
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const NoteCardMenu = ({
    note
}: {
    note: Note,
}) => {
    const { showTrashed, toggleTrashNote, deleteNote, toggleArchiveNote, togglePinnedNote } = useNotes();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const noteSettingsRef = useRef<NoteSettingsRef>(null);

    const handleToggleTrashNote = async () => {
        setLoading(true);
        await toggleTrashNote(note.id, !note.trashed);
        setLoading(false);
    }

    const handleToggleArchiveNote = async () => {
        setLoading(true);
        await toggleArchiveNote(note);
        setLoading(false);
    }

    const handleTogglePinnedNote = async () => {
        setLoading(true);
        await togglePinnedNote(note);
        setLoading(false);
    }

    const handleDeletePermanently = async () => {
        setLoading(true);
        await deleteNote(note.id);
        setLoading(false);
    }

    const handleOpenNote = () => {
        navigate(`/note/${note.id}`, { viewTransition: true });
    }

    return (
        <>
            <NoteSettings ref={noteSettingsRef} note={note} />
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon
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
                        onClick={() => {
                            noteSettingsRef.current?.open();
                        }}
                    >
                        Customize
                    </Menu.Item>
                    <Menu.Item
                        leftSection={note.pinned ? <IconPinnedFilled size={14} /> : <IconPinned size={14} />}
                        onClick={handleTogglePinnedNote}
                    >
                        {note.pinned ? "Unpin" : "Pin"}
                    </Menu.Item>
                    <Menu.Item
                        leftSection={note.archived ? <IconArchiveOff size={14} /> : <IconArchive size={14} />}
                        onClick={handleToggleArchiveNote}
                    >
                        {note.archived ? "Unarchive" : "Archive"}
                    </Menu.Item>

                    <Menu.Divider />
                    <Menu.Item
                        color={note.trashed ? "green" : "red"}
                        onClick={handleToggleTrashNote}
                        leftSection={note.trashed ? <IconRestore size={14} /> : <IconTrash size={14} />}
                    >
                        {note.trashed ? "Restore" : "Trash"}
                    </Menu.Item>
                    {showTrashed &&
                        <Menu.Item
                            color={"red"}
                            onClick={handleDeletePermanently}
                            leftSection={<IconBomb size={14} />}
                        >
                            Delete Permanently
                        </Menu.Item>
                    }
                </Menu.Dropdown>
            </Menu>
        </>
    )
}

export default NoteCardMenu