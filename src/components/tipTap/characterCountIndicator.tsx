import { Editor, useCurrentEditor } from "@tiptap/react";

export default function CharacterCountIndicator({
  editor,
  limit,
}: {
  editor: Editor;
  limit: number;
}) {
  return (
    <span className="text-xs text-muted-foreground">
      {editor.storage.characterCount.characters()}/{limit} characters
    </span>
  );
}
