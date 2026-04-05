import ExampleTheme from "./lexical/themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ToolbarPlugin } from "./lexical/plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./lexical/plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./lexical/plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./lexical/plugins/AutoLinkPlugin";

function Placeholder() {
  return <div className="absolute top-3 left-4 sm:top-4 sm:left-6 text-[15px] text-gray-400 pointer-events-none select-none">Enter some rich text...</div>;
}

const editorConfig = {
  // The editor theme
  namespace: "CopyBabyEditor",
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";

export function Editor(props: any) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm w-full text-left flex flex-col">
        <ToolbarPlugin />
        <div className="relative flex-1 rounded-b-lg">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[200px] outline-none resize-none px-4 py-3 sm:min-h-[300px] sm:px-6 sm:py-4 text-[15px] text-gray-900" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary as any}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const textContent = $getRoot().getTextContent();
                props.onChange?.(
                  textContent,
                  editorState.toJSON(),
                  textContent.trim().length
                );
              });
            }}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
