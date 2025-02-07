import { Badge, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import NotesTopMenu from "./NotesTopMenu"
import ToggleArchivedFilter from "./ToggleArchivedFilter"
import { useNotes } from "@/hooks/useNotes"
import { useEffect, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"

const NotesToolBar = ({
    onSearchKeywordChange = () => { },
}: {
    onSearchKeywordChange?: (keyword: string) => void
}) => {
    const { showArchived } = useNotes()
    const [searchKeyword, setSearchKeyword] = useDebouncedState("", 1000, { leading: true });
    const [isDebouncing, setIsDebouncing] = useState(false);

    useEffect(() => {
        onSearchKeywordChange(searchKeyword);
        setIsDebouncing(false);
    }, [searchKeyword]);


    return (
        <div className="absolute left-0 top-0 w-full z-50">
            <Group justify="center" gap={"sm"} p={"sm"} wrap="nowrap">
                <ToggleArchivedFilter />
                <TextInput
                    className="grow"
                    rightSectionPointerEvents="none"
                    defaultValue={searchKeyword}
                    rightSection={<IconSearch className={isDebouncing ? "animate-pulse animate-duration-[250ms]" : ""} />}
                    placeholder="Search"
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                        setIsDebouncing(true);
                    }}
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