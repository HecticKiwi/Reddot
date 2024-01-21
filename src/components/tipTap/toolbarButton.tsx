import { Toggle } from "@/components/ui/toggle";
import { ChainedCommands, Editor, useCurrentEditor } from "@tiptap/react";
import { LucideIcon } from "lucide-react";

export default function ToolbarButton({
  editor,
  pressed,
  action,
  icon,
}: {
  editor: Editor;
  pressed: boolean;
  action: (command: ChainedCommands) => ChainedCommands;
  icon: LucideIcon;
}) {
  const Icon = icon;

  return (
    <Toggle
      size="sm"
      variant="outline"
      pressed={pressed}
      disabled={!action(editor.can().chain().focus()).run()}
      onClick={() => action(editor.chain().focus()).run()}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  );
}
