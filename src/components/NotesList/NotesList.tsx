import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import Loading from "../Loading";
import { IconCookieMan, IconSparkles } from "@tabler/icons-react";
import { ScrollArea, Space, Stack, Text } from "@mantine/core";
import NoteCard from "./NoteCard";
import { Note } from "@/context/notes";



const NotesList = ({
    notes,
    notesLoading,
}: {
    notes: Note[],
    notesLoading: boolean
}) => {
    const { user, isLoading: userLoading } = useAuth();

    if (userLoading || notesLoading) return <Loading />;
    if (!user) return (
        <>
            <IconCookieMan size={32} className="mx-auto" />
            <Text c="dimmed" size="xs" className="text-center">Not logged in</Text>
        </>
    );
    return (
        <>
            {notes.length === 0 ? (
                <>
                    <IconSparkles size={32} className="mx-auto" />
                    <Text c="dimmed" size="xs" className="text-center">No notes</Text>
                </>
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