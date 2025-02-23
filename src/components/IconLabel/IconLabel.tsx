import { Stack, Text, StackProps } from "@mantine/core"
import { IconSkull } from "@tabler/icons-react"
const IconLabel = ({
    label = null,
    icon = <IconSkull className="animate-shake" />,
    ...props
}: {
    label?: string | null,
    icon?: React.ReactNode,
} & StackProps) => {
    return (
        <Stack w={"100%"} h={"100%"} align="center" justify="center" gap={"xs"} {...props}>
            {icon && icon}
            {label &&
                <Text c={"dimmed"} size="xs">{label}</Text>
            }
        </Stack>
    )
}

export default IconLabel