import { useNotes } from "@/hooks/useNotes";
import { Menu, ActionIcon } from "@mantine/core";
import { IconArchive, IconArchiveFilled, IconFile, IconFileFilled, IconTable, IconTrash, IconTrashFilled } from "@tabler/icons-react";

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

    const MenuIcon = () => {
        if (showTrashed) return <IconTrash />;
        if (showArchived) {
            return <IconArchive />;
        } else {
            return <IconFile />
        }
    }

    return (
        <Menu shadow="md" width={200} withArrow position="bottom-start">
            <Menu.Target>
                <ActionIcon
                    size={"input-sm"}
                    variant="default"
                >
                    <MenuIcon />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Main</Menu.Label>
                <Menu.Item
                    leftSection={!showArchived && !showTrashed ? <IconFileFilled size={14} /> : <IconFile size={14} />}
                    onClick={() => {
                        setShowArchived(false)
                        setShowTrashed(false)
                    }}
                >
                    Notes
                </Menu.Item>
                <Menu.Item
                    leftSection={showArchived ? <IconArchiveFilled size={14} /> : <IconArchive size={14} />}
                    onClick={() => {
                        setShowArchived(true)
                        setShowTrashed(false)
                    }}
                >
                    Archived
                </Menu.Item>
                <Menu.Item
                    leftSection={showTrashed ? <IconTrashFilled size={14} /> : <IconTrash size={14} />}
                    onClick={() => {
                        setShowArchived(false)
                        setShowTrashed(true)
                    }}
                >
                    Trashed
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default FoldersAndMore