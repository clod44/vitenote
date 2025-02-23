import { Badge, CloseButton, Group, Stack, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import NotesTopMenu from "./NotesTopMenu"
import { useEffect, useState } from "react"
import BackgroundGradient from "@/components/BackgroundGradient/"
import FoldersAndMore from "./FoldersAndMore"
import { useNotes } from "@/hooks/useNotes"
import { useFolders } from "@/hooks/useFolders"

const NotesTopBar = ({
    handleSearch = () => { },
    showArchived = false,
    setShowArchived = () => { },
    isLoading = false,
}: {
    handleSearch?: (keyword?: string, showArchived?: boolean) => void
    showArchived?: boolean
    setShowArchived?: (archived: boolean) => void
    isLoading?: boolean
}) => {
    const { showTrashed } = useNotes();
    const [searchKeyword, setSearchKeyword] = useState("");
    const { selectedFolder, selectFolder } = useFolders();

    useEffect(() => {
        handleSearch(searchKeyword, showArchived);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [searchKeyword, showArchived]);


    return (
        <div className="absolute left-0 top-0 w-full z-50">
            <BackgroundGradient deg={180} start={50}>
                <Group justify="center" gap={"sm"} p={"sm"} wrap="nowrap">
                    <FoldersAndMore
                        showArchived={showArchived}
                        setShowArchived={setShowArchived}
                    />
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
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full -translate-y-1/2">
                        <Stack
                            justify="center"
                            align="center"
                        >
                            {selectedFolder &&
                                <Badge
                                    c={selectedFolder.color}
                                    rightSection={<CloseButton variant="subtle" size="xs" onClick={() => selectFolder(-1)} />}
                                    variant="default"
                                    size="xs">
                                    {selectedFolder.title}
                                </Badge>
                            }
                            {showArchived &&
                                <Badge variant="default" size="xs">Your Archive</Badge>
                            }
                            {showTrashed &&
                                <Badge variant="default" size="xs">Your Trash</Badge>
                            }
                        </Stack>
                    </div>
                </div>
            </BackgroundGradient>
        </div>
    )
}

export default NotesTopBar