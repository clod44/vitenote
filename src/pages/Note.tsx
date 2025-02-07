import TextEditor from "@/components/TextEditor";
import { useNotes } from "@/hooks/useNotes";
import { useDebouncedCallback, useDebouncedState } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { Note as NoteType } from "@/context/notes";
import { useEffect, useRef, useState } from "react";
import { TextEditorRef } from "@/components/TextEditor/TextEditor";
import Loading from "@/components/Loading";
import SomethingWentWrong from "@/components/SomethingWentWrong";
import NoteToolBar from "@/components/NoteToolBar";

const Note = () => {
    const { id } = useParams();
    const editorRef = useRef<TextEditorRef | null>(null);
    const [note, setNote] = useDebouncedState<NoteType | null>(null, 1000, { leading: true });
    const [noteLoading, setNoteLoading] = useState(true);
    const [noteCloudSynced, setNoteCloudSynced] = useState(false);

    /* 
    TODO: tidy up the Note component
    this is retarded but otherwise editor initializes late and cant catch up with editable flag setting
    */
    const [isEditable, setIsEditable] = useState(false);

    const { notes, updateNote, getNote } = useNotes();

    const handleNoteUpdate = (data: { [key: string]: string }) => {
        setNoteCloudSynced(false);
        debouncedUpdateNote(data);
    };
    const debouncedUpdateNote = useDebouncedCallback((data: { [key: string]: string }) => {
        if (note) {
            const newNote = { ...note, ...data } as NoteType;
            setNote(newNote);
            updateNote(newNote);
        }
    }, 1000);

    useEffect(() => {
        setNoteCloudSynced(true);
    }, [notes]);

    useEffect(() => {
        const retrieveNote = async () => {
            if (!id) return;
            try {
                setNoteLoading(true);
                const note = await getNote(parseInt(id));
                if (note) {
                    editorRef.current?.setContent(note.content);
                    setIsEditable(true);
                    setNote(note);
                } else {
                    setIsEditable(false);
                    setNote(null);
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

    return (
        <>
            <NoteToolBar note={note} noteLoading={noteLoading} noteCloudSynced={noteCloudSynced} handleNoteUpdate={handleNoteUpdate} />
            {noteLoading ? (
                <Loading label="Retrieving your note..." />
            ) : (
                note == null ? (
                    <SomethingWentWrong />
                ) : (
                    <TextEditor
                        defaultValue={note?.content || ""}
                        onChange={(value) => handleNoteUpdate({ content: value })}
                        ref={editorRef}
                        isEditable={isEditable}
                    />
                )
            )}
        </>
    )
}

export default Note