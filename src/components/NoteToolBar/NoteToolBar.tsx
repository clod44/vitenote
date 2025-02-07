import GenericTopBar from "@/components/GenericTopBar"
import { Note } from "@/context/notes"
import { ActionIcon, Group, Modal, Paper, Space, Stack, Switch, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconCloudCheck, IconCloudPause, IconDotsVertical, IconSettings } from "@tabler/icons-react"


const NoteToolBar = ({
    note,
    noteLoading = true,
    noteCloudSynced = null,
    handleNoteUpdate = () => { }, //for debounced title update
}: {
    note: Note | null,
    noteLoading?: boolean,
    noteCloudSynced?: boolean | null,
    handleNoteUpdate?: (data: { [key: string]: string }) => void
}) => {
    const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false);
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
                        noteCloudSynced !== null && (
                            noteCloudSynced
                                ? <IconCloudCheck />
                                : <IconCloudPause className="animate-pulse" />
                        )}
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
        </>
    )
}

export default NoteToolBar