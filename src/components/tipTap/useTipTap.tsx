import { cn } from "@/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import { Editor, EditorOptions, Extensions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export type ConfigOptions = {
  readOnly?: boolean;
  placeholder?: string;
  content: string;
  limit?: number;
  onChange?: (content: string) => void;
};

export const createEditorConfig: ({
  readOnly,
  placeholder,
  limit,
  onChange,
}: ConfigOptions) => Partial<EditorOptions> = ({
  readOnly,
  content,
  placeholder,
  limit,
  onChange,
}) => ({
  content,
  extensions: [
    TextStyle.configure(),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    CharacterCount.configure({
      limit,
    }),
  ],
  injectCSS: true,
  editable: !readOnly,
  editorProps: {
    attributes: {
      class: cn(
        "prose prose-sm dark:prose-invert",
        !readOnly && "max-w-full rounded-lg border p-8",
      ),
    },
  },
  onUpdate: ({ editor }) => {
    onChange?.(editor.getHTML());
    console.log(editor.getHTML());
  },
});

const useTipTap = (config: ConfigOptions) => {
  const { placeholder, limit, content, onChange, readOnly } = config;

  const editorConfig = createEditorConfig({
    readOnly,
    placeholder,
    limit,
    onChange,
    content,
  });

  const editor = useEditor(editorConfig);

  return editor;
};

export default useTipTap;
