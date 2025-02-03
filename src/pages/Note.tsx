import GenericTopBar from "@/components/GenericTopBar";
import Loading from "@/components/Loading";
import TextEditor from "@/components/TextEditor";
import { ActionIcon, Modal, Paper, Space, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconSettings } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

const Note = () => {
    const { id } = useParams();
    const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false);


    if (!id) {
        return (
            <Loading label="Creating your note" />
        )
    }

    return (
        <>

            <GenericTopBar>
                <TextInput
                    placeholder="Title"
                    className="grow"
                />
                <Modal
                    opened={modalOpened}
                    onClose={modalClose}
                    withCloseButton={false}
                    styles={{
                        inner: {
                            padding: "0",
                        },
                        content: {
                            marginTop: "auto",
                            padding: "0",
                        },
                        body: {
                            padding: "0",
                        }
                    }}
                >
                    <Paper
                        withBorder
                        shadow="md"
                        radius="md"
                        p="md"
                    >
                        <Stack
                            w={"100%"}
                            align="stretch"
                            gap={"md"}
                        >
                            <Text c={"dimmed"} size="xs" className="flex items-center gap-2">
                                <IconSettings />
                                Options
                                <div className="grow" />
                                last updated 3 hours ago
                            </Text>

                            <TextInput
                                label="Title"
                                placeholder="Title"
                                className="flex-grow"
                                defaultValue={"more stuff here"}
                            />
                            <Switch
                                label="Archived"
                                defaultChecked
                            />
                        </Stack>
                    </Paper>
                </Modal>
                <ActionIcon
                    variant="default"
                    size={"input-sm"}
                    onClick={modalOpen}
                >
                    <IconDotsVertical />
                </ActionIcon>
            </GenericTopBar>


            <Space h={"md"} my={"md"} />

            <TextEditor />

        </>
    )
}

export default Note