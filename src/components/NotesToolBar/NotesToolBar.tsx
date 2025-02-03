import { Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import NotesTopMenu from "./NotesTopMenu"
import ToggleArchivedFilter from "./ToggleArchivedFilter"

const NotesToolBar = () => {
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
        </div>
    )
}

export default NotesToolBar