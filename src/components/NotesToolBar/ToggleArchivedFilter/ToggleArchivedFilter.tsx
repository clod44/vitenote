import { ActionIcon } from "@mantine/core"
import { IconArchive, IconArchiveFilled } from "@tabler/icons-react"
import { useState } from "react"


const ToggleArchivedFilter = () => {
    const [showArchived, setShowArchived] = useState(false)
    return (
        <ActionIcon
            size={"input-sm"}
            variant="default"
            onClick={() => setShowArchived(!showArchived)}
        >
            {showArchived ? <IconArchiveFilled /> : <IconArchive />}
        </ActionIcon>
    )
}

export default ToggleArchivedFilter