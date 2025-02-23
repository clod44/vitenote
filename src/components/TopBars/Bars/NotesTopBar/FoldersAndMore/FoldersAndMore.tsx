import BackgroundGradient from "@/components/BackgroundGradient";
import IconLabel from "@/components/IconLabel";
import { useFolders } from "@/hooks/useFolders";
import { useNotes } from "@/hooks/useNotes";
import { Menu, ActionIcon, Group, ScrollArea, Paper, Stack, Space, Text } from "@mantine/core";
import { IconArchive, IconArchiveFilled, IconEdit, IconFile, IconFileFilled, IconFolder, IconFolderOpen, IconGhost2Filled, IconTrash, IconTrashFilled } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FoldersAndMore = ({
    showArchived = false,
    setShowArchived = () => { },
}: {
    showArchived?: boolean,
    setShowArchived?: (archived: boolean) => void
    showTrashed?: boolean,
    setShowTrashed?: (trashed: boolean) => void
}) => {
    const { showTrashed, setShowTrashed } = useNotes();
    const navigate = useNavigate();
    const [menuOpened, setMenuOpened] = useState(false);
    const { folders, selectFolder, selectedFolder } = useFolders();

    const handleFolderSelect = (id: number) => {
        console.log(id);
        selectFolder(id);
        setMenuOpened(false);
    }

    const MenuIcon = () => {
        if (selectedFolder) return <IconFolderOpen />
        if (showTrashed) return <IconTrash />;
        if (showArchived) {
            return <IconArchive />;
        } else {
            return <IconFile />
        }
    }

    const handleNotesClick = () => {
        setShowArchived(false);
        setShowTrashed(false);
        handleFolderSelect(-1);
    }

    const handleArchivedClick = () => {
        setShowArchived(true);
        setShowTrashed(false);
        handleFolderSelect(-1);
    }

    const handleTrashedClick = () => {
        setShowArchived(false);
        setShowTrashed(true);
        handleFolderSelect(-1);
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
                    leftSection={!selectedFolder && !showArchived && !showTrashed ? <IconFileFilled size={14} /> : <IconFile size={14} />}
                    onClick={handleNotesClick}
                >
                    Notes
                </Menu.Item>
                <Menu.Item
                    leftSection={!selectedFolder && showArchived ? <IconArchiveFilled size={14} /> : <IconArchive size={14} />}
                    onClick={handleArchivedClick}
                >
                    Archived
                </Menu.Item>
                <Menu.Item
                    leftSection={!selectedFolder && showTrashed ? <IconTrashFilled size={14} /> : <IconTrash size={14} />}
                    onClick={handleTrashedClick}
                >
                    Trashed
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