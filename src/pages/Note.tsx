import GenericTopBar from "@/components/GenericTopBar";
import TextEditor from "@/components/TextEditor";
import { useNotes } from "@/hooks/useNotes";
import { ActionIcon, Group, Modal, Paper, Space, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconSettings } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { Note as NoteType } from "@/context/notes";
import { useEffect, useRef } from "react";
import { TextEditorRef } from "@/components/TextEditor/TextEditor";

const Note = () => {
    const { id } = useParams();
    const [note, setNote] = useDebouncedState<NoteType | null>(null, 1000, { leading: true });
    const editorRef = useRef<TextEditorRef | null>(null);
    const { notes, updateNote } = useNotes();
    const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNoteUpdate = (data: { [key: string]: any }) => {
        if (note) {
            setNote({ ...note, ...data } as NoteType);
        }
    }

    useEffect(() => {
        //debounced useEffect
        if (note) {
            console.log(note);
            updateNote(note);
        } else {
            editorRef.current?.editor?.setEditable(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);

    useEffect(() => {
        if (!id) return;
        const _note = notes.find((note) => note.id == parseInt(id)) || null;
        if (_note) {
            editorRef.current?.setContent(_note.content);
            editorRef.current?.editor?.setEditable(true);
        }
        setNote(_note);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            <GenericTopBar backButtonPath={"/"}>
                <TextInput
                    placeholder="Title"
                    className="grow"
                    defaultValue={note?.title}
                    readOnly={note == null}
                    onChange={(e) => handleNoteUpdate({ title: e.target.value })}
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
                    disabled={note == null}
                    onClick={modalOpen}
                >
                    <IconDotsVertical />
                </ActionIcon>
            </GenericTopBar>

            <Space h={"md"} my={"md"} />

            <TextEditor
                defaultValue={note?.content || ""}
                onChange={(value) => handleNoteUpdate({ content: value })}
                ref={editorRef}
                readOnly={true} // will later update this
            />
        </>
    )
}

export default Note