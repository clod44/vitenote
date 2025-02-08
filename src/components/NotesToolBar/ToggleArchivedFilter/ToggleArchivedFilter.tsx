import { useNotes } from "@/hooks/useNotes"
import { ActionIcon } from "@mantine/core"
import { IconArchive, IconArchiveFilled } from "@tabler/icons-react"

const ToggleArchivedFilter = ({
    showArchived = false,
    setShowArchived = () => { },
}: {
    showArchived?: boolean,
    setShowArchived?: (archived: boolean) => void
}) => {

    return (
        <ActionIcon
            size={"input-sm"}
            variant="default"
            onClick={() => setShowArchived(!showArchived)}
        >
            {showArchived ? <IconArchiveFilled className="animate-fade" /> : <IconArchive className="animate-fade" />}
        </ActionIcon>
    )
}

export default ToggleArchivedFilter