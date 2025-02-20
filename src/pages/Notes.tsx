import CreateNoteFab from "@/components/CreateNoteFab";
import NotesList from "@/components/NotesList";
import NotesToolBar from "@/components/NotesToolBar";
import { Note } from "@/context/notes";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { useEffect, useState } from "react";

const Notes = () => {
    const { user, isLoading: userLoading } = useAuth();
    const { notes, isLoading: notesLoading, showTrashed } = useNotes(); //notes will become trashed notes when necessary context function is called
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [showArchived, setShowArchived] = useState(false);


    /**
     * Handles search and filtering of notes based on the keyword and settings.
     * 
     * @param {string} [keyword=""] - The keyword to search for in the notes' titles.
     * 
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
            <NotesList notes={filteredNotes} notesLoading={notesLoading} />
            {user && !userLoading && !notesLoading && !showArchived && !showTrashed && <CreateNoteFab />}
        </>
    )
}

export default Notes