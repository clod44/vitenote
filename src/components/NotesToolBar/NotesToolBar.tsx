import { Badge, Group, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import NotesTopMenu from "./NotesTopMenu"
import ToggleArchivedFilter from "./ToggleArchivedFilter"
import { useEffect, useState } from "react"

const NotesToolBar = ({
    showArchived = false,
    setShowArchived = () => { },
    handleSearch = () => { },
    isLoading = false,
}: {
    showArchived?: boolean
    setShowArchived?: (archived: boolean) => void
    handleSearch?: (keyword?: string, showArchived?: boolean) => void
    isLoading?: boolean
}) => {
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        handleSearch(searchKeyword, showArchived);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [searchKeyword, showArchived]);


    return (
        <div className="absolute left-0 top-0 w-full z-50">
            <Group justify="center" gap={"sm"} p={"sm"} wrap="nowrap">
                <ToggleArchivedFilter showArchived={showArchived} setShowArchived={setShowArchived} />
                <TextInput
                    className="grow"
                    rightSectionPointerEvents="none"
                    defaultValue={searchKeyword}
                    rightSection={<IconSearch className={isLoading ? "animate-pulse animate-duration-[250ms]" : ""} />}
                    placeholder="Search"
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
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