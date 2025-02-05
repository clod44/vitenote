import Loading from "@/components/Loading";
import NoteCard from "@/components/NoteCard"
import NotesToolBar from "@/components/NotesToolBar"
import { useAuth } from "@/context/auth";
import { ScrollArea, Space, Stack, Text } from "@mantine/core"
import { IconCookieMan } from "@tabler/icons-react";


const Notes = () => {
    const { user, isLoading } = useAuth();

    return (
        <>
            <NotesToolBar />
            {isLoading ? (
                <Loading />
            ) : (
                !user ? (
                    <Stack h={"100%"} w={"100%"} justify="center" align="center">
                        <IconCookieMan size={32} />
                        <Text c={"dimmed"} size="xs" className="text-center">Not logged in</Text>
                    </Stack>
                ) : (
                    <ScrollArea w={"100%"} h={"100%"} type="never">
                        <Space h={"xl"} my={"md"} />
                        <Stack
                            px={"sm"}
                            w={"100%"}
                            align="stretch"
                            gap={"sm"}
                        >
                            {Array.from({ length: 100 }).map((_, index) => (
                                <NoteCard key={index} />
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