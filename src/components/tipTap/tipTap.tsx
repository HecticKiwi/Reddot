"use client";

import { cn } from "@/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import {
  Editor,
  EditorContent,
  EditorOptions,
  EditorProvider,
  Extensions,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menuBar";
import CharacterCountIndicator from "./characterCountIndicator";
import { ConfigOptions, editorConfig } from "./useTipTap";

export default function TipTap({
  editor,
  limit = 1000,
  className,
}: {
  editor: Editor | ConfigOptions;
  limit?: number;
  className?: string;
}) {
  const a = editor instanceof Editor ? editor : useEditor(editorConfig(editor));

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
