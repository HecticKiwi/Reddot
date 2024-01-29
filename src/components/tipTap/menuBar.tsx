import { Editor, useCurrentEditor } from "@tiptap/react";
import {
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  TextQuote,
} from "lucide-react";
import ToolbarButton from "./toolbarButton";

export default function MenuBar({ editor }: { editor: Editor }) {
  return (
    <>
      <div className="mb-2 flex flex-wrap gap-2">
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("heading", { level: 2 })}
          action={(command) => command.toggleHeading({ level: 2 })}
          icon={Heading2}
        />
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("italic")}
          action={(command) => command.toggleItalic()}
          icon={Italic}
        />
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("strike")}
          action={(command) => command.toggleStrike()}
          icon={Strikethrough}
        />
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("code")}
          action={(command) => command.toggleCode()}
          icon={Code}
        />
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("bulletList")}
          action={(command) => command.toggleBulletList()}
          icon={List}
        />
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("orderedList")}
          action={(command) => command.toggleOrderedList()}
          icon={ListOrdered}
        />
        <ToolbarButton
          editor={editor}
          pressed={editor.isActive("blockquote")}
          action={(command) => command.toggleBlockquote()}
          icon={TextQuote}
        />
      </div>
    </>
  );
}
