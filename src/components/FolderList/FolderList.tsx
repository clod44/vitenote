import Loading from "@/components/Loading";
import IconLabel from "@/components/IconLabel";
import { IconDeviceFloppy, IconGhost2Filled } from "@tabler/icons-react";
import { ActionIcon, Group, ScrollArea, Space, Stack, TextInput } from "@mantine/core";
import FolderCard from "@/components/FolderCard";
import { Folder } from "@/context/folders";
import Modal, { ModalRef } from "@/components/Modal";
import { useEffect, useRef, useState } from "react";
import ColorSelector, { colors, ColorSelectorRef } from "@/components/ColorSelector";
import { useForm } from "@mantine/form";
import { useFolders } from "@/hooks/useFolders";

const FolderList = () => {
    const { folders, isLoading, deleteFolder, updateFolder } = useFolders();
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
    const editModalRef = useRef<ModalRef>(null);
    const colorSelectorRef = useRef<ColorSelectorRef>(null);
    const folderForm = useForm({
        mode: 'uncontrolled',
        initialValues: { title: 'Folder', color: 'gray' },
        validate: {
            title: (value) => value.trim().length > 0 ? null : 'Title is required',
            color: (value) => colors.includes(value) ? null : 'Invalid color',
        },
    });

    const handleFolderUpdate = (values: typeof folderForm.values) => {
        if (editingFolder) {
            updateFolder({ id: editingFolder.id, ...values });
            editModalRef.current?.close();
        }
    };

    const handleColorSelectorChange = (color: string) => {
        folderForm.setFieldValue('color', color);
    };

    const handleEditClick = (folder: Folder) => {
        setEditingFolder(folder);
        folderForm.setValues({ title: folder.title, color: folder.color });
        editModalRef.current?.open();
    };

    useEffect(() => {
        if (editingFolder && colorSelectorRef.current) {
            colorSelectorRef.current.setValue(editingFolder.color);
        }
    }, [editingFolder]);

    const handleDeleteFolder = (id: number) => {
        deleteFolder(id);
    }


    if (isLoading) return <Loading />;
    if (folders.length === 0) return <IconLabel label="No folders found" icon={<IconGhost2Filled size={32} />} />;
    return (
        <>
            <Modal title="Edit Folder" ref={editModalRef} >
                <form onSubmit={folderForm.onSubmit(handleFolderUpdate)}>
                    <Group align="center" gap={"md"} justify="space-between">
                        <TextInput
                            className="grow"
                            placeholder="Title"
                            size="sm"
                            key={folderForm.key('title')}
                            {...folderForm.getInputProps('title')}
                        />
                        <ActionIcon.Group>
                            <ColorSelector ref={colorSelectorRef} defaultValue={editingFolder?.color} size={"input-sm"} onChange={handleColorSelectorChange} />
                            <ActionIcon variant="default" type="submit" size={"input-sm"}><IconDeviceFloppy /></ActionIcon>
                        </ActionIcon.Group>
                    </Group>
                </form>
            </Modal>
            <ScrollArea w={"100%"} h={"100%"} scrollbars="y" type="never">
                <Space h={"xl"} my={"md"} />
                <Stack w={"100%"} gap={"md"} px={"md"} >
                    {folders.map((folder) => (
                        <FolderCard key={folder.id} folder={folder} handleEditClick={handleEditClick} handleDeleteFolder={handleDeleteFolder} />
                    ))}
                </Stack>

                <Space h={"xl"} my={"md"} />
                <Space h={"xl"} my={"md"} />
                <Space h={"xl"} my={"md"} />
                <Space h={"xl"} my={"md"} />
            </ScrollArea >
        </>
    )

}

export default FolderList