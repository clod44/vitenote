import { Folder } from "@/context/folders"
import { ActionIcon, Group, Paper, Text } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"

const FolderCard = ({
    folder,
    handleEditClick,
    handleDeleteFolder,
}: {
    folder: Folder,
    handleEditClick?: (folder: Folder) => void,
    handleDeleteFolder?: (id: number) => void
}) => {
    return (
        <Paper
            key={folder.id}
            shadow="md"
            radius="md"
            withBorder
            p={0}
            m={0}
            className="overflow-hidden"
        >
            <div className="w-full h-full flex flex-nowrap items-stretch">
                <div className="min-w-1 " style={{
                    backgroundColor: "var(--mantine-color-" + folder.color + "-filled)",
                    transition: "background-color .5s ease-in-out",
                }}>
                </div>

                <Group className="grow" align="center" gap={"xs"} p="md">
                    <Text size="sm" className="grow">{folder.title}</Text>
                    <ActionIcon.Group>
                        <ActionIcon variant="default" size={"input-xs"} c={"dimmed"} onClick={() => handleEditClick && handleEditClick(folder)}><IconEdit size={16} /></ActionIcon>
                        <ActionIcon variant="default" size={"input-xs"} c={"red"} onClick={() => handleDeleteFolder && handleDeleteFolder(folder.id)}><IconTrash size={16} /></ActionIcon>
                    </ActionIcon.Group>
                </Group>
            </div>
        </Paper>
    )
}

export default FolderCard
