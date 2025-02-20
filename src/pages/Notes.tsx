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
    const { notes, isLoading: notesLoading, showTrashed, fetchNotes } = useNotes(); //notes will become trashed notes when necessary context function is called
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [showArchived, setShowArchived] = useState(false);

    const { isRefreshing, pullPosition } = usePullToRefresh({
        // you can choose what behavior for `onRefresh`, could be calling an API to load more data, or refresh whole page.
        onRefresh: fetchNotes,
        maximumPullLength: MAXIMUM_PULL_LENGTH,
        refreshThreshold: REFRESH_THRESHOLD,
        isDisabled: false
    });


    /**
     * Handles search and filtering of notes based on the keyword and settings.
     * @param {string} [keyword=""] - The keyword to search for in the notes' titles.
     * also responsible for instant ui feedback of archiving/deleting etc 
     */
    const handleSearch = (keyword: string = "") => {
        if (!notes) return;
        //when we are not looking at the trashbin and we set one of the note as trashed, we should filter it out here
        const filteredByTrashed = notes.filter(note => note.trashed === showTrashed);
        //don't filter by archived if we are in the trash bin
        const filteredByArchived = showTrashed ?
            filteredByTrashed :
            filteredByTrashed.filter(note => {
                return note.archived === showArchived;
            });
        //don't filter by keyword if no keyword is given
        const filteredByKeyword = keyword.length === 0 ?
            filteredByArchived :
            filteredByArchived.filter(note =>
                note.title.toLowerCase().includes(keyword.toLowerCase())
            );
        setFilteredNotes(filteredByKeyword);
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