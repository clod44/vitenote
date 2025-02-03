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

    const content =
        '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';


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