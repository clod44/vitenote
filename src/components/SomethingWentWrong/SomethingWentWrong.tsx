import { Stack, Text } from "@mantine/core"
import { IconSkull } from "@tabler/icons-react"

const SomethingWentWrong = ({
    label = null
}: {
    label?: string | null
}) => {
    return (
        <Stack w={"100%"} align="center" gap={"md"}>
            <IconSkull className="animate-shake" />
            <Text c={"dimmed"} size="xs">
                {label || "Something went wrong"}
            </Text>
        </Stack>
    )
}

export default SomethingWentWrong