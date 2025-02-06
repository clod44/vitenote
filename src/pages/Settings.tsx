import GenericTopBar from "@/components/GenericTopBar"
import { Text } from "@mantine/core"
import { IconFishBone } from "@tabler/icons-react"

const Settings = () => {
    return (
        <>
            <GenericTopBar title="Settings" />
            <IconFishBone size={32} className="mx-auto" />
            <Text c={"dimmed"} size="xs" className="text-center">Empty</Text>
        </>
    )
}

export default Settings