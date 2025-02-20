import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import NotesToolBar from "@/components/NotesToolBar";
import { Note } from "@/context/notes";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { ThemeIcon } from "@mantine/core";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePullToRefresh } from 'use-pull-to-refresh';

const MAXIMUM_PULL_LENGTH = 240;
const REFRESH_THRESHOLD = 180;

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { notes, isLoading: notesLoading, showTrashed, fetchNotes, filterNotes } = useNotes();
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [showArchived, setShowArchived] = useState(false);

    const { isRefreshing, pullPosition } = usePullToRefresh({
        onRefresh: fetchNotes,
        maximumPullLength: MAXIMUM_PULL_LENGTH,
        refreshThreshold: REFRESH_THRESHOLD,
        isDisabled: false
    });

    const handleSearch = (keyword: string = "") => {
        const newNotes = filterNotes(keyword, showArchived);
        setFilteredNotes(newNotes);
    };

    useEffect(() => {
        if (userLoading || notesLoading) return;
        handleSearch();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [notesLoading, notes, userLoading, user]);

    return (
        <>
            <NotesToolBar
                handleSearch={handleSearch}
                showArchived={showArchived}
                setShowArchived={setShowArchived}
            />
            <div
                style={{
                    top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 3,
                    opacity: isRefreshing || pullPosition > 0 ? 1 : 0
                }}
                className='fixed w-full z-30 p-5 '
            >
                <div
                    className={` flex items-center justify-center ${isRefreshing ? 'animate-spin' : ''}`}
                    style={!isRefreshing ? { transform: `rotate(${pullPosition}deg)` } : {}}
                >
                    <ThemeIcon variant="default" radius={"xl"}>
                        <IconLoader />
                    </ThemeIcon>
                </div>
            </div>
            <NotesList notes={filteredNotes} notesLoading={notesLoading} />
            {user && !userLoading && !notesLoading && !showArchived && !showTrashed && <CreateNoteFab />}
        </>
    )
}

export default Notes