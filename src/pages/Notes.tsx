import CreateNoteFab from "@/components/CreateNoteFab";
import Loading from "@/components/Loading";
import NoteCard from "@/components/NoteCard"
import NotesToolBar from "@/components/NotesToolBar"
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { ScrollArea, Space, Stack, Text } from "@mantine/core"
import { IconCookieMan } from "@tabler/icons-react";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { notes, isLoading: notesLoading } = useNotes();

    return (
        <>
            <NotesToolBar />
            {userLoading || notesLoading ? (
                <Loading />
            ) : (
                !user ? (
                    <Stack h={"100%"} w={"100%"} justify="center" align="center">
                        <IconCookieMan size={32} />
                        <Text c={"dimmed"} size="xs" className="text-center">Not logged in</Text>
                    </Stack>
                ) : (
                    <ScrollArea w={"100%"} h={"100%"} type="never">
                        <CreateNoteFab />
                        <Space h={"xl"} my={"md"} />
                        <Stack
                            px={"sm"}
                            w={"100%"}
                            align="stretch"
                            gap={"sm"}
                        >
                            {notes.length === 0 && <Text c={"dimmed"} size="xs" className="text-center">No notes found</Text>}
                            {notes.map((note) => (
                                <NoteCard key={note.id} note={note} />
                            ))}
                        </Stack>
                        <Space h={"xl"} my={"md"} />
                    </ScrollArea>
                )
            )}
        </>
    )
}

export default Notes