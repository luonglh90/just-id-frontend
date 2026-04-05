import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  LexicalEditor,
} from "lexical";
import { Select, Button, Space, ConfigProvider } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  LinkOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const BLOCK_TYPES = [
  { label: "Normal", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Quote", value: "quote" },
];

function applyBlockType(editor: LexicalEditor, type: string) {
  editor.update(() => {
    const selection = $getSelection();
    if (type === "paragraph") {
      $setBlocksType(selection, () => $createParagraphNode());
    } else if (type === "quote") {
      $setBlocksType(selection, () => $createQuoteNode());
    } else {
      $setBlocksType(selection, () =>
        $createHeadingNode(type as "h1" | "h2" | "h3")
      );
    }
  });
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-gray-200" />;
}

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let topLevelElement = $findMatchingParent(anchorNode, (e) => {
        const parent = e.getParent();
        return parent !== null && $isRootOrShadowRoot(parent);
      });
      if (topLevelElement === null) {
        topLevelElement = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(topLevelElement)) {
        setBlockType(topLevelElement.getTag());
      } else {
        setBlockType(topLevelElement.getType());
      }
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorText: "#666",
            colorBgTextHover: "#e5e5e5",
            colorBgTextActive: "#d4d4d4",
          },
          Select: {
            colorBorder: "transparent",
            colorBgContainer: "transparent",
          },
        },
      }}
    >
      <div className="flex items-center gap-0.5 p-1.5 border-b border-gray-200 bg-[#fbfbfb] rounded-t-lg overflow-x-auto whitespace-nowrap">
        <Space.Compact size="small">
          <Button
            type="text"
            icon={<UndoOutlined />}
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            className="text-gray-500 hover:text-gray-800"
            title="Undo"
          />
          <Button
            type="text"
            icon={<RedoOutlined />}
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            className="text-gray-500 hover:text-gray-800"
            title="Redo"
          />
        </Space.Compact>

        <Divider />

        <Select
          value={blockType}
          onChange={(val) => {
            setBlockType(val);
            applyBlockType(editor, val);
          }}
          options={BLOCK_TYPES}
          style={{ width: 110 }}
          bordered={false}
          className="text-gray-700 font-medium"
        />

        <Divider />

        <Space.Compact size="small">
          <Button
            type="text"
            icon={<BoldOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            className={isBold ? "bg-gray-200" : ""}
            title="Bold"
          />
          <Button
            type="text"
            icon={<ItalicOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
            className={isItalic ? "bg-gray-200" : ""}
            title="Italic"
          />
          <Button
            type="text"
            icon={<UnderlineOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
            className={isUnderline ? "bg-gray-200" : ""}
            title="Underline"
          />
          <Button
            type="text"
            icon={<StrikethroughOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
            className={isStrikethrough ? "bg-gray-200" : ""}
            title="Strikethrough"
          />
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
            className={isCode ? "bg-gray-200" : ""}
            title="Code"
          />
          <Button
            type="text"
            icon={<LinkOutlined />}
            title="Link"
            disabled
          />
        </Space.Compact>

        <Divider />

        <Space.Compact size="small">
          <Button
            type="text"
            icon={<AlignLeftOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
            title="Left Align"
          />
          <Button
            type="text"
            icon={<AlignCenterOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
            title="Center Align"
          />
          <Button
            type="text"
            icon={<AlignRightOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
            title="Right Align"
          />
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
            title="Justify Align"
          />
        </Space.Compact>
      </div>
    </ConfigProvider>
  );
}
