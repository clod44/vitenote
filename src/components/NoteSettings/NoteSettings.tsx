import { Note } from "@/context/notes";
import Modal, { ModalRef } from "@/components/Modal";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface NoteSettingsRef extends ModalRef { }

const NoteSettings = forwardRef(({
    note,
    noteLoading = true,
}: {
    note?: Note | null,
    noteLoading?: boolean
}, ref) => {
    const modalRef = useRef<ModalRef>(null);

    useImperativeHandle(ref, () => modalRef.current as ModalRef, [modalRef]);

    return (
        <Modal title="Note Options" ref={modalRef}>
            <p>modal settings here</p>
            <p>{noteLoading ? "loading" : "loaded"}</p>
            <p>{JSON.stringify(note, null, 2)}</p>
        </Modal>
    );
});

export default NoteSettings;
