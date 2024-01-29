"use client";

import { cn } from "@/lib/utils";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import CharacterCountIndicator from "./characterCountIndicator";
import MenuBar from "./menuBar";
import { ConfigOptions, createEditorConfig } from "./useTipTap";

export default function TipTap({
  editor,
  limit = 1000,
  className,
}: {
  editor: Editor | ConfigOptions;
  limit?: number;
  className?: string;
}) {
  const a =
    // eslint-disable-next-line
    editor instanceof Editor ? editor : useEditor(createEditorConfig(editor));

  if (!a) {
    return null;
  }

  return (
    <div className={cn("max-w-full", className)}>
      {a.isEditable && <MenuBar editor={a} />}

      <EditorContent editor={a} />

      {a.isEditable && <CharacterCountIndicator editor={a} limit={limit} />}
    </div>
  );
}
