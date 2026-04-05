import { $getListDepth, $isListItemNode, $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isElementNode, $isRangeSelection, COMMAND_PRIORITY_HIGH, INDENT_CONTENT_COMMAND } from "lexical";
import { useEffect } from "react";

type Props = {
  maxDepth: number;
};

export default function ListMaxIndentLevelPlugin({ maxDepth }: Props): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return false;
        }

        const nodes = selection.getNodes();

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const element = $isElementNode(node) ? node : node.getParent();
          if (element && $isListItemNode(element)) {
            const listNode = element.getParent();
            if ($isListNode(listNode) && $getListDepth(listNode) >= maxDepth) {
              return true; // Stop propagation/indenting
            }
          }
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, maxDepth]);

  return null;
}
