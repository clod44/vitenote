import NoteCard from "@/components/NoteCard"
import NotesToolBar from "@/components/NotesToolBar"
import { ScrollArea, Space, Stack } from "@mantine/core"


const Notes = () => {
    return (
        <>
            <NotesToolBar />
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
        </>
    )
}

export default Notes