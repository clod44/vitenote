import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { IconSparkles, IconUser, IconUserCancel } from "@tabler/icons-react";
import { ScrollArea, Space, Stack, Text } from "@mantine/core";
import NoteCard from "./NoteCard";
import { Note } from "@/context/notes";
import IconLabel from "@/components/IconLabel";


const NotesList = ({
    notes,
    notesLoading,
}: {
    notes: Note[],
    notesLoading: boolean,
}) => {
    const { user } = useAuth();

    if (notesLoading) return <Loading />;
    if (!user) return <IconLabel label="Not logged in" icon={<IconUserCancel size={32} />} />
    return (
        <>
            {notes.length === 0 ? (
                <IconLabel label="No notes found" icon={<IconSparkles size={32} />} />
            ) : (
                < ScrollArea w={"100%"} h={"100%"} type="never">
                    <Space h={"xl"} my={"md"} />
                    <Stack
                        px={"sm"}
                        w={"100%"}
                        align="stretch"
                        gap={"sm"}
                    >
                        {notes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </Stack>
                    <Space h={"xl"} my={"md"} />
                </ScrollArea >
            )}
        </>
    )
};

export default NotesList