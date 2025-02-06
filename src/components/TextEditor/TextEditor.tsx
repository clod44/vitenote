import { RichTextEditor, Link } from '@mantine/tiptap';
import { BubbleMenu, Editor, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import { ScrollArea } from '@mantine/core';
import { forwardRef, useImperativeHandle } from 'react';

export interface TextEditorRef {
    getContent: () => string;
    setContent: (content: string) => void;
    editor: Editor | null;
    setEditable: (editable: boolean) => void
}

const TextEditor = forwardRef(({
    defaultValue = "",
    onChange = () => { },
    isEditable = true
}: {
    defaultValue?: string,
    onChange?: (value: string) => void,
    isEditable?: boolean
}, ref) => {



    const editor = useEditor({
        editable: isEditable,
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Click here to start typing...' })
        ],
        content: defaultValue || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useImperativeHandle(ref, () => ({
        getContent: () => editor?.getHTML() || "",
        setContent: (content: string) => editor?.commands.setContent(content),
        editor: editor,
        setEditable: (editable: boolean) => {
            if (isEditable === editable) return;
            editor?.setEditable(editable)
        }
    }));

    return (
        <ScrollArea h={"100%"} w={"100%"} scrollbars={"y"}>
            <RichTextEditor w={"100%"} editor={editor} styles={{
                root: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: 0,
                },
                content: {
                    backgroundColor: "transparent",
                },
                toolbar: {
                    justifyContent: "center",
                    alignItems: "center",
                    gap: ".5em",
                    paddingTop: 0,
                }
            }}>
                {isEditable && (
                    <>
                        <RichTextEditor.Toolbar sticky>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Underline />
                                <RichTextEditor.Strikethrough />
                                <RichTextEditor.ClearFormatting />
                                <RichTextEditor.Highlight />
                                <RichTextEditor.Code />
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H1 />
                                <RichTextEditor.H2 />
                                <RichTextEditor.H3 />
                                <RichTextEditor.H4 />
                            </RichTextEditor.ControlsGroup>


                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link />
                                <RichTextEditor.Unlink />
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Blockquote />
                                <RichTextEditor.Hr />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                                <RichTextEditor.Subscript />
                                <RichTextEditor.Superscript />
                            </RichTextEditor.ControlsGroup>


                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.AlignLeft />
                                <RichTextEditor.AlignCenter />
                                <RichTextEditor.AlignJustify />
                                <RichTextEditor.AlignRight />
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Undo />
                                <RichTextEditor.Redo />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        {editor && (
                            <BubbleMenu editor={editor}>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Link />
                                </RichTextEditor.ControlsGroup>
                            </BubbleMenu>
                        )}
                    </>
                )}
                <RichTextEditor.Content />
            </RichTextEditor>
        </ScrollArea >
    );
});

export default TextEditor;