import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { IconSparkles } from "@tabler/icons-react";
import { ScrollArea, Space, Stack, Text } from "@mantine/core";
import NoteCard from "./NoteCard";
import { Note } from "@/context/notes";
import SomethingWentWrong from "@/components/SomethingWentWrong";



const NotesList = ({
    notes,
    notesLoading,
}: {
    notes: Note[],
    notesLoading: boolean,
}) => {
    const { user } = useAuth();

    if (notesLoading) return <Loading />;
    if (!user) return <SomethingWentWrong label={"Not logged in"} />
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