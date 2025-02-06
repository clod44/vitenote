import GenericTopBar from "@/components/GenericTopBar";
import TextEditor from "@/components/TextEditor";
import { useNotes } from "@/hooks/useNotes";
import { ActionIcon, Group, Modal, Paper, Space, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useDebouncedCallback, useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconCloudCheck, IconCloudPause, IconDotsVertical, IconSettings, IconSkull } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { Note as NoteType } from "@/context/notes";
import { useEffect, useRef, useState } from "react";
import { TextEditorRef } from "@/components/TextEditor/TextEditor";
import Loading from "@/components/Loading";

const Note = () => {
    const { id } = useParams();
    const editorRef = useRef<TextEditorRef | null>(null);
    const [note, setNote] = useDebouncedState<NoteType | null>(null, 1000, { leading: true });
    const [noteLoading, setNoteLoading] = useState(true);
    const [noteCloudSynced, setNoteCloudSynced] = useState(false);

    /* 
    TODO: tidy up the Note component
    this is retarded but otherwise editor initializes late and cant catch up with editable flag setting
    */
    const [isEditable, setIsEditable] = useState(false);

    const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false);
    const { notes, updateNote, getNote } = useNotes();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNoteUpdate = (data: { [key: string]: any }) => {
        setNoteCloudSynced(false);
        debouncedUpdateNote(data);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debouncedUpdateNote = useDebouncedCallback((data: { [key: string]: any }) => {
        if (note) {
            const newNote = { ...note, ...data } as NoteType;
            setNote(newNote);
            updateNote(newNote);
        }
    }, 1000);

    useEffect(() => {
        setNoteCloudSynced(true);
    }, [notes]);

    useEffect(() => {
        const retrieveNote = async () => {
            if (!id) return;
            try {
                setNoteLoading(true);
                const note = await getNote(parseInt(id));
                if (note) {
                    editorRef.current?.setContent(note.content);
                    setIsEditable(true);
                    setNote(note);
                } else {
                    setIsEditable(false);
                    setNote(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setNoteLoading(false);
            }
        }

        retrieveNote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            <GenericTopBar backButtonPath={"/"}>
                <TextInput
                    placeholder="Title"
                    className="grow"
                    defaultValue={note?.title}
                    readOnly={note == null || noteLoading}
                    onChange={(e) => handleNoteUpdate({ title: e.target.value })}
                    rightSection={
                        noteCloudSynced ? <IconCloudCheck /> : <IconCloudPause className="animate-pulse" />
                    }

                />
                <Modal
                    opened={modalOpened}
                    onClose={modalClose}
                    withCloseButton={false}
                    styles={{
                        inner: {
                            padding: "0",
                        },
                        content: {
                            marginTop: "auto",
                            padding: "0",
                        },
                        body: {
                            padding: "0",
                        }
                    }}
                >
                    <Paper
                        withBorder
                        shadow="md"
                        radius="md"
                        p="md"
                    >
                        <Stack
                            w={"100%"}
                            align="stretch"
                            gap={"md"}
                        >
                            <Group justify="space-between" gap={"md"}>
                                <Text c={"dimmed"} size="xs" className="flex items-center gap-2">
                                    <IconSettings />
                                    Options
                                </Text>
                                <Text c={"dimmed"} size="xs" className="flex items-center gap-2">
                                    Last updated 3 hours ago
                                </Text>
                            </Group>

                            <TextInput
                                label="Title"
                                placeholder="Title"
                                className="flex-grow"
                                defaultValue={"more stuff here"}
                            />
                            <Switch
                                label="Archived"
                                defaultChecked
                            />
                        </Stack>
                    </Paper>
                </Modal>
                <ActionIcon
                    variant="default"
                    size={"input-sm"}
                    disabled={note == null || noteLoading}
                    onClick={modalOpen}
                >
                    <IconDotsVertical />
                </ActionIcon>
            </GenericTopBar>

            <Space h={"md"} my={"md"} />

            {noteLoading ? (
                <Loading label="Retrieving your note..." />
            ) : (
                !noteLoading && note == null ? (
                    <Stack w={"100%"} align="center" gap={"md"}>
                        <IconSkull className="animate-shake" />
                        <Text c={"dimmed"} size="xs">
                            Something went wrong while loading your note.
                        </Text>
                        <Text c={"dimmed"} size="xs">
                            Try refreshing the app.
                        </Text>
                    </Stack>
                ) : (
                    <TextEditor
                        defaultValue={note?.content || ""}
                        onChange={(value) => handleNoteUpdate({ content: value })}
                        ref={editorRef}
                        isEditable={isEditable}
                    />
                )
            )}
        </>
    )
}

export default Note