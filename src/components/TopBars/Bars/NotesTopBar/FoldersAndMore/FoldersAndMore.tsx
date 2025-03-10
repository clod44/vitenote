import BackgroundGradient from "@/components/BackgroundGradient";
import IconLabel from "@/components/IconLabel";
import { useFolders } from "@/hooks/useFolders";
import { useNotes } from "@/hooks/useNotes";
import { Menu, ActionIcon, Group, ScrollArea, Paper, Stack, Space, Text } from "@mantine/core";
import { useCounter, useToggle } from "@mantine/hooks";
import { IconArchive, IconArchiveFilled, IconEdit, IconFile, IconFileFilled, IconFlare, IconFlareFilled, IconFolder, IconFolderOpen, IconGhost2Filled, IconTrash, IconTrashFilled } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const FoldersAndMore = ({
    showArchived = false,
    setShowArchived = () => { },
}: {
    showArchived?: boolean
    setShowArchived?: (archived: boolean) => void
}) => {
    const { setShowTrashed, setShowFollowed } = useNotes();
    const navigate = useNavigate();
    const [menuOpened, setMenuOpened] = useState(false);
    const { folders, selectFolder, selectedFolder } = useFolders();
    const selectedCategoryRef = useRef<Category>("notes");

    type Category = "notes" | "archived" | "trashed" | "followed" | "folders";
    const changeCategory = (index: Category) => {
        //reset all
        selectedCategoryRef.current = index;
        selectFolder(-1);
        setShowArchived(false);
        setShowTrashed(false);
        setShowFollowed(false);
        switch (index) {
            case "notes":
                //show notes. do nothing extra for this
                break;
            case "archived":
                setShowArchived(true);
                break;
            case "trashed":
                setShowTrashed(true);
                break;
            case "followed":
                setShowFollowed(true);
                break;
            case "folders":
                //show folders.
                break;
            default:
                console.log("Invalid category index:", index);
                break;
        }
        setMenuOpened(false);
    }
    const handleFolderSelect = (id: number) => {
        changeCategory("folders");
        selectFolder(id);
    }

    const MenuIcon = () => {
        switch (selectedCategoryRef.current) {
            case "notes":
                return <IconFile />
            case "archived":
                return <IconArchive />
            case "trashed":
                return <IconTrash />
            case "followed":
                return <IconFlare />
            case "folders":
                return <IconFolder />
        }
    }

    return (
        <Menu opened={menuOpened} onChange={setMenuOpened} shadow="md" width={200} withArrow position="bottom-start">
            <Menu.Target>
                <ActionIcon
                    size={"input-sm"}
                    variant="default"
                    c={selectedFolder?.color}
                >
                    <MenuIcon />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Main</Menu.Label>
                <Menu.Item
                    leftSection={selectedCategoryRef.current === "notes" ?
                        <IconFileFilled size={14} />
                        :
                        <IconFile size={14} />}
                    onClick={() => changeCategory("notes")}
                >
                    Notes
                </Menu.Item>
                <Menu.Item
                    leftSection={selectedCategoryRef.current === "archived" ?
                        <IconArchiveFilled size={14} />
                        :
                        <IconArchive size={14} />}
                    onClick={() => changeCategory("archived")}
                >
                    Archived
                </Menu.Item>
                <Menu.Item
                    leftSection={selectedCategoryRef.current === "trashed" ?
                        <IconTrashFilled size={14} />
                        :
                        <IconTrash size={14} />}
                    onClick={() => changeCategory("trashed")}
                >
                    Trashed
                </Menu.Item>
                <Menu.Item
                    leftSection={selectedCategoryRef.current === "followed" ?
                        <IconFlareFilled size={14} />
                        :
                        <IconFlare size={14} />}
                    onClick={() => changeCategory("followed")}
                >
                    Followed
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>
                    <Group align="center" justify="space-between">
                        Folders
                        <ActionIcon
                            c={"dimmed"}
                            size={"xs"}
                            variant="default"
                            onClick={() => navigate("/folders")}>
                            <IconEdit />
                        </ActionIcon>
                    </Group>
                </Menu.Label>

                <Menu.Item closeMenuOnClick={false} p={0} m={0} className="overflow-hidden">
                    <Paper withBorder shadow="md" className="overflow-hidden aspect-square">
                        <div className="relative overflow-hidden w-full h-full">
                            <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none  flex flex-col justify-between">
                                <BackgroundGradient deg={180} start={10}>
                                    <Space h={"md"} />
                                </BackgroundGradient>
                                <BackgroundGradient deg={0} start={10}>
                                    <Space h={"md"} />
                                </BackgroundGradient>
                            </div>
                            {folders.length === 0 ? (
                                <IconLabel c={"dimmed"} icon={<IconGhost2Filled size={16} />} label="No Folders" className="animate-pulse" />
                            ) : (
                                <ScrollArea type="hover" scrollbarSize={5} h={"100%"} >
                                    <Stack gap={"xs"} p={"xs"}>
                                        {folders.map((folder) =>
                                            <Paper
                                                withBorder
                                                c={folder.color}
                                                className={`
                                                    cursor-pointer
                                                    ${selectedFolder?.id === folder.id ? "scale-105" : ""} 
                                                    `}
                                                key={folder.id}
                                                onClick={() => handleFolderSelect(folder.id)}
                                            >
                                                <Group
                                                    align="center"
                                                    gap={"xs"}
                                                    p={"xs"}>
                                                    {selectedFolder?.id === folder.id ?
                                                        <IconFolderOpen size={14} />
                                                        :
                                                        <IconFolder size={14} />
                                                    }
                                                    <Text size="sm">{folder.title}</Text>
                                                </Group>
                                            </Paper>
                                        )}
                                    </Stack>
                                </ScrollArea>
                            )}
                        </div>
                    </Paper>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu >
    )
}

export default FoldersAndMore