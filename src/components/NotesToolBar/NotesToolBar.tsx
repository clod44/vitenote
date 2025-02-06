import { Badge, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import NotesTopMenu from "./NotesTopMenu"
import ToggleArchivedFilter from "./ToggleArchivedFilter"
import { useNotes } from "@/hooks/useNotes"

const NotesToolBar = () => {
    const { showArchived } = useNotes()
    return (
        <div className="absolute left-0 top-0 w-full z-50">
            <Group justify="center" gap={"sm"} p={"sm"} wrap="nowrap">
                <ToggleArchivedFilter />
                <TextInput
                    className="grow"
                    rightSectionPointerEvents="none"
                    rightSection={<IconSearch />}
                    placeholder="Search"
                />
                <NotesTopMenu />
            </Group>
            {showArchived &&
                <div className="relative">
                    <Badge variant="default" size="xs" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full ">Your Archive</Badge>
                </div>
            }
        </div>
    )
}

export default NotesToolBar