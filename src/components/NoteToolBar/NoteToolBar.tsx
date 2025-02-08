import GenericTopBar from "@/components/GenericTopBar"
import { Note } from "@/context/notes"
import { ActionIcon, Space, TextInput } from "@mantine/core";
import { IconCloudCheck, IconCloudPause, IconDotsVertical } from "@tabler/icons-react"
import NoteSettings, { NoteSettingsRef } from "@/components/NoteSettings"
import { useRef } from "react"


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
    const noteSettingsRef = useRef<NoteSettingsRef>(null);

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
                <NoteSettings ref={noteSettingsRef} note={note} noteLoading={noteLoading} />
                <ActionIcon
                    variant="default"
                    size={"input-sm"}
                    disabled={note == null || noteLoading}
                    onClick={noteSettingsRef.current?.open}
                >
                    <IconDotsVertical className={note == null || noteLoading ? "animate-pulse" : ""} />
                </ActionIcon>
            </GenericTopBar>
            <Space h={"md"} my={"md"} />
        </>
    )
}

export default NoteToolBar