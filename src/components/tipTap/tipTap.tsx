"use client";

import { cn } from "@/lib/utils";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import CharacterCountIndicator from "./characterCountIndicator";
import MenuBar from "./menuBar";
import { ConfigOptions, createEditorConfig } from "./useTipTap";

export default function TipTap({
  editor: editorOrConfig,
  limit = 1000,
  className,
}: {
  editor: Editor | ConfigOptions;
  limit?: number;
  className?: string;
}) {
  const editor =
    editorOrConfig instanceof Editor
      ? editorOrConfig
      : // eslint-disable-next-line
        useEditor(createEditorConfig(editorOrConfig));

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("max-w-full", className)}>
      {editor.isEditable && <MenuBar editor={editor} />}

      <EditorContent editor={editor} />

      {editor.isEditable && (
        <CharacterCountIndicator editor={editor} limit={limit} />
      )}
    </div>
  );
}
