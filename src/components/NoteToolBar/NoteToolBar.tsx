import GenericTopBar from "@/components/GenericTopBar"
import { Note } from "@/context/notes"
import { ActionIcon, Center, Divider, Group, Popover, Space, Text, TextInput, ThemeIcon } from "@mantine/core";
import { IconCloudCheck, IconCloudDown, IconCloudPause, IconDotsVertical, IconUsersGroup, IconWorld, IconWorldSearch } from "@tabler/icons-react"
import NoteSettings, { NoteSettingsRef } from "@/components/NoteSettings"
import { useRef } from "react"
import CopyField from "../CopyField";


const NoteToolBar = ({
    note,
    noteLoading = true,
    editable = false,
    isPublic = false,
    noteCloudSynced = null,
    handleNoteUpdate = () => { }, //for debounced title update
}: {
    note: Note | null,
    noteLoading?: boolean,
    editable?: boolean,
    isPublic?: boolean
    noteCloudSynced?: boolean | null,
    handleNoteUpdate?: (data: { [key: string]: string }) => void
}) => {
    const noteSettingsRef = useRef<NoteSettingsRef>(null);

    const inputRightSection = () => {
        if (noteLoading) return <IconCloudDown className="animate-pulse" />;
        if (editable)
            if (typeof noteCloudSynced === "boolean") {
                return noteCloudSynced ? <IconCloudCheck /> : <IconCloudPause className="animate-pulse" />;
            }
        return <></>;
    }

    return (
        <>
            <GenericTopBar backButtonPath={"/"}>
                <TextInput
                    placeholder="Title"
                    className="grow"
                    defaultValue={note?.title}
                    readOnly={note == null || noteLoading || !editable}
                    onChange={(e) => handleNoteUpdate({ title: e.target.value })}
                    rightSection={inputRightSection()}
                />
                <NoteSettings ref={noteSettingsRef} note={note} noteLoading={noteLoading} />
                {isPublic && note ? (
                    <Popover
                        width={220}
                        position="bottom"
                        withArrow
                        shadow="md">
                        <Popover.Target >
                            <ActionIcon
                                variant="default"
                                size={"input-sm"}
                                c={"dimmed"}
                            >
                                <IconWorld />
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
                            <Text mt={"sm"} size="xs" c={"dimmed"} className="text-center">updated at {new Date(note.updated_at).toLocaleDateString()}</Text>
                            <Text size="xs" c={"dimmed"} className="text-center">created at {new Date(note.created_at).toLocaleDateString()}</Text>
                        </Popover.Dropdown>
                    </Popover>
                ) : (
                    <ActionIcon
                        variant="default"
                        size={"input-sm"}
                        disabled={note == null || noteLoading}
                        onClick={noteSettingsRef.current?.open}
                    >
                        <IconDotsVertical className={note == null || noteLoading ? "animate-pulse" : ""} />
                    </ActionIcon>
                )}
            </GenericTopBar >
            <Space h={"md"} my={"md"} />
        </>
    )
}

export default NoteToolBar