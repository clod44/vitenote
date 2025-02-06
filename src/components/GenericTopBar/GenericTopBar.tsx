import { ActionIcon, Group, Text } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

const GenericTopBar = ({
    title,
    backButtonPath = "/",
    backButtonUseHistory = false,
    children,
}: {
    title?: string,
    backButtonPath?: string | null,
    backButtonUseHistory?: boolean
    children?: React.ReactNode
}) => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        if (!backButtonUseHistory && backButtonPath) {
            navigate(backButtonPath);
            return;
        }
        window.history.back();
    }

    return (
        <div className="absolute left-0 top-0 w-full z-50">
            <Group justify="flex-start" gap={"sm"} p={"sm"} wrap="nowrap">
                <ActionIcon variant="default" size={"input-sm"} onClick={handleGoBack}>
                    <IconChevronLeft />
                </ActionIcon>
                {title && <Text size="md" className="grow">{title}</Text>}
                {children}
            </Group>
        </div>
    )
}

export default GenericTopBar