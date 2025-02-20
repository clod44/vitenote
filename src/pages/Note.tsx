import TextEditor from "@/components/TextEditor";
import { useNotes } from "@/hooks/useNotes";
import { useDebouncedCallback } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { Note as NoteType } from "@/context/notes";
import { useEffect, useRef, useState } from "react";
import { TextEditorRef } from "@/components/TextEditor/TextEditor";
import Loading from "@/components/Loading";
import { NoteTopBar } from "@/components/TopBars";
import { useAuth } from "@/hooks/useAuth";
import IconLabel from "@/components/IconLabel";
import { IconSkull } from "@tabler/icons-react";

const Note = () => {
    const { id } = useParams();
    const { notes, updateNote, getNote } = useNotes();
    const { user } = useAuth();

    const editorRef = useRef<TextEditorRef | null>(null);

    const [clientNote, setClientNote] = useState<NoteType | null>(null);
    const [noteCloudSynced, setNoteCloudSynced] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [noteLoading, setNoteLoading] = useState(true);


    const handleNoteUpdate = (data: Partial<NoteType>) => {
        setNoteCloudSynced(false);
        if (!clientNote || !isOwner || noteLoading) return;
        debouncedUpdateNote(data);
    };

    const debouncedUpdateNote = useDebouncedCallback((data: Partial<NoteType>) => {
        if (!clientNote) return;
        const updatedNote = { ...clientNote, ...data };
        setClientNote(updatedNote);
        updateNote({ id: updatedNote.id, ...data });
    }, 1000);

    //update echo with new data. this is required for inter-component data update visibility.
    useEffect(() => {
        if (!clientNote || !user || clientNote.user_id !== user.id) return;
        setNoteCloudSynced(true);
        if (clientNote) {
            const updatedNote = notes.find((n) => n.id === clientNote.id);
            if (updatedNote) {
                setClientNote(updatedNote);
            } else {
                alert("Note not found on server to be able to update the client");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notes]);

    //initial note data fetch
    useEffect(() => {
        const retrieveNote = async () => {
            if (!id) return;
            try {
                setNoteLoading(true);
                const note = await getNote(parseInt(id));
                if (note) {
                    editorRef.current?.setContent(note.content);
                    setIsOwner(note.user_id === user?.id);
                    setClientNote(note);
                } else {
                    alert("Note not found on server to be able to retrieve");
                    setClientNote(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setNoteLoading(false);
            }
        }

        retrieveNote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //we use client note in these.
    return (
        <>
            <NoteTopBar
                editable={isOwner}
                isPublic={!isOwner}
                note={clientNote}
                noteLoading={noteLoading}
                noteCloudSynced={noteCloudSynced}
                handleNoteUpdate={handleNoteUpdate}
            />
            {noteLoading ? (
                <Loading label="Retrieving your note..." />
            ) : (
                clientNote == null ? (
                    <IconLabel label="Note not found" icon={<IconSkull size={32} />} />
                ) : (
                    <TextEditor
                        defaultValue={clientNote?.content || ""}
                        onChange={(value) => handleNoteUpdate({ content: value })}
                        ref={editorRef}
                        isEditable={isOwner}
                    />
                )
            )}
        </>
    )
}

export default Note