import { Stack, Text } from "@mantine/core"
import { IconSkull } from "@tabler/icons-react"

const IconLabel = ({
    label = null,
    icon = <IconSkull className="animate-shake" />
}: {
    label?: string | null,
    icon?: React.ReactNode
}) => {
    return (
        <Stack w={"100%"} align="center" gap={"md"}>
            {icon && icon}
            {label &&
                <Text c={"dimmed"} size="xs">{label}</Text>
            }
        </Stack>
    )
}

export default IconLabel