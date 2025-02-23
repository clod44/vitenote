import { GenericTopBar } from "@/components/TopBars";
import PullToRefresh from "@/components/PullToRefresh";
import { useAuth } from "@/hooks/useAuth";
import { useFolders } from "@/hooks/useFolders";
import Fab from "@/components/Fab";
import { Space } from "@mantine/core";
import { IconFolderPlus } from "@tabler/icons-react";
import BackgroundGradient from "@/components/BackgroundGradient";
import FolderList from "@/components/FolderList";

/**
 * Folder add/edit page
 */
const Folders = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { isLoading: foldersLoading, createFolder } = useFolders();

    return (
        <>
            <GenericTopBar title="Folders" />
            <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none">
                <BackgroundGradient deg={180} start={50} >
                    <Space h={"xl"} />
                    <Space h={"xl"} />
                </BackgroundGradient>
            </div>
            <PullToRefresh onRefresh={() => { }} />
            <FolderList />
            {user && !userLoading && !foldersLoading && <Fab onClick={createFolder}><IconFolderPlus /></Fab>}
        </>
    )
}

export default Folders