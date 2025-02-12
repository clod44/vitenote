import { Note } from "@/context/notes";
import Modal, { ModalRef } from "@/components/Modal";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IconCheck, IconCopy, IconLoader, IconLock, IconSettings, IconWorld } from "@tabler/icons-react";
import { ActionIcon, CopyButton, Group, SimpleGrid, Switch, Text, TextInput, Tooltip } from "@mantine/core";
import Loading from "@/components/Loading";
import { useNotes } from "@/hooks/useNotes";
import ColorSelector from "@/components/ColorSelector";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NoteSettingsRef extends ModalRef { }

const NoteSettings = forwardRef(({
    note,
    noteLoading = false,
}: {
    note?: Note | null,
    noteLoading?: boolean
}, ref) => {
    const [values, setValues] = useState<Partial<Note>>({
        public: note?.public || false,
        color: note?.color || "gray",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { updateNote } = useNotes();

    const modalRef = useRef<ModalRef>(null);
    useImperativeHandle(ref, () => modalRef.current as ModalRef, [modalRef]);


    const handleSettingsUpdate = async () => {
        if (!note) return;
        setIsLoading(true);
        await updateNote({ id: note.id, ...values });
        setIsLoading(false);
    }

    useEffect(() => {
        if (note && modalRef.current?.opened) handleSettingsUpdate();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [values])

    useEffect(() => {
        if (note && modalRef.current) {
            setValues({
                public: note.public,
                color: note.color,
            });
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [noteLoading]);

    return (
        <Modal
            title="Note Options"
            icon={isLoading ? <IconLoader className="animate-spin" size={16} /> : <IconSettings size={16} />}
            ref={modalRef}
        >
            {noteLoading ? (
                <Loading label="Loading note settings" />
            ) : (
                <SimpleGrid cols={1} verticalSpacing={"xs"}>
                    <Group align="center" gap={"md"} justify="space-between">
                        <Text size="sm">Public Note</Text>
                        <Switch
                            size="md"
                            onLabel={<IconWorld size={16} />}
                            offLabel={<IconLock size={16} />}
                            checked={values.public}
                            onChange={(e) => setValues({ ...values, public: e.currentTarget.checked })}
                        />
                    </Group>
                    {note && values.public && !noteLoading &&
                        <TextInput
                            size="sm"
                            placeholder="url"
                            defaultValue={window.location.origin + "/note/" + note.id}
                            readOnly
                            className="animate-fade"
                            rightSection={
                                < CopyButton value={window.location.origin + "/note/" + note.id} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                            <ActionIcon variant="default" c={"dimmed"} onClick={copy}>
                                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            } />
                    }
                    <Group align="center" gap={"md"} justify="space-between">
                        <Text size="sm">Color</Text>
                        <ColorSelector
                            defaultValue={values.color}
                            onChange={(color) => setValues({ ...values, color })}
                        />
                    </Group>
                </SimpleGrid>
            )}
        </Modal >
    );
});

export default NoteSettings;
