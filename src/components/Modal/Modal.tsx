import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Modal as MantineModal, Group, Stack, Text, Paper, CloseButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";

export interface ModalRef {
    open: () => void,
    close: () => void,
    opened: boolean,
}

const Modal = forwardRef(({
    title = "Options",
    icon = <IconSettings size={16} />,
    children,
    onOpenChange
}: {
    title?: string,
    icon?: React.ReactNode,
    children?: React.ReactNode
    onOpenChange?: (opened: boolean) => void
}, ref) => {
    const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false);

    useImperativeHandle(ref, () => ({
        open: modalOpen,
        close: modalClose,
        opened: modalOpened,
    }));

    useEffect(() => {
        if (onOpenChange) onOpenChange(modalOpened);
    }, [modalOpened]);

    return (
        <MantineModal
            onClick={(e) => e.stopPropagation()}
            opened={modalOpened}
            onClose={modalClose}
            withCloseButton={false}
            centered
            transitionProps={{
                transition: "fade",
                duration: 50,
                timingFunction: "ease",
            }}
            overlayProps={{
                opacity: 1,
                blur: 5,
            }}
            styles={{
                content: {
                    padding: "0",
                    backgroundColor: "transparent",
                },
                body: {
                    padding: "0",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
            }}
        >
            <Paper withBorder shadow="md" radius="md" p="md">
                <Stack w={"100%"} align="stretch" gap={"md"}>
                    <Group justify="center" gap={"md"}>
                        <Text c={"dimmed"} size="xs" className="flex items-center gap-1 flex-grow">
                            {icon}
                            {title}
                        </Text>
                        <Text c={"dimmed"} size="xs" className="flex items-center gap-2">
                            Last updated 3 hours ago
                        </Text>
                        <CloseButton variant="subtle" size="xs" onClick={modalClose} />
                    </Group>
                    {children}
                </Stack>
            </Paper>
        </MantineModal>
    )
});

export default Modal;
