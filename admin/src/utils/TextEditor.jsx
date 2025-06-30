/* eslint-disable react/prop-types */
import "katex/dist/katex.min.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSize } from "./fontSizeExtension";
import FileHandler from "@tiptap-pro/extension-file-handler";
import { Mathematics } from "@tiptap-pro/extension-mathematics";
import ImageResize from "tiptap-extension-resize-image";
import { useEffect, useState } from "react";
import { API_URL } from "../url";
import axios from "axios";
import MathEditor from "./MathsEditor";
import MathModal from "./MathModel";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableActions from "./TableActions";
import { CustomTableCell } from "./CustomTableCell";
import toast from "react-hot-toast";
import {
  Bold,
  Italic,
  ListOrdered,
  Underline as ULIcon,
  List as LIIcon,
  Subscript as SUBIcon,
  Superscript as SUPIcon,
  Heading as HIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ChevronUp,
  ChevronDown,
  ALargeSmall,
  X,
  Link2,
  Link2Off,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          return attributes.width ? { width: attributes.width } : {};
        },
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          return attributes.height ? { height: attributes.height } : {};
        },
      },
    };
  },
});

const Tiptap = ({ placeholder, getHtmlData, initialContent }) => {
  const [headingOptionOpen, setHeadingOptionOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMathModalOpen, setIsMathModalOpen] = useState(false);
  const [isInitialContentSet, setIsInitialContentSet] = useState(false);

  const editor = useEditor({
    extensions: [
      Placeholder.configure({ placeholder: placeholder || "Start typing..." }),
      StarterKit,
      Document,
      Text,
      Underline,
      Link,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph", "table", "image"],
      }),
      TextStyle,
      FontSize,
      FontFamily,
      MathEditor,
      Mathematics,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      ResizableImage,
      ImageResize,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
          "image/*",
        ],

        async onDrop(currentEditor, files, pos) {
          for (const file of files) {
            try {
              const formData = new FormData();
              formData.append("image", file);
              const response = await axios.post(
                `${API_URL}/admin/courses/uplodecourseimage.php`,
                formData,
                { headers: { "content-type": "multipart/form-data" } }
              );

              if (response?.data?.url) {
                currentEditor
                  .chain()
                  .insertContentAt(pos, {
                    type: "image",
                    attrs: {
                      src: response.data.url,
                    },
                  })
                  .focus()
                  .run();
              }
            } catch (error) {
              console.log(error);
              toast.error(error?.response?.data?.message || "Image Error");
              alert(error?.response?.data?.message || "Image Error");
            }
          }
        },
        async onPaste(currentEditor, files, htmlContent) {
          for (const file of files) {
            if (htmlContent) {
              return false;
            }

            try {
              const formData = new FormData();
              formData.append("image", file);
              const response = await axios.post(
                `${API_URL}/admin/courses/uplodecourseimage.php`,
                formData,
                { headers: { "content-type": "multipart/form-data" } }
              );

              if (response?.data?.url) {
                currentEditor
                  .chain()
                  .insertContentAt(currentEditor.state.selection.anchor, {
                    type: "image",
                    attrs: {
                      src: response.data.url,
                    },
                  })
                  .focus()
                  .run();
              }
            } catch (error) {
              console.log(error);
              toast.error(error?.response?.data?.message || "Image Error");
              alert(error?.response?.data?.message || "Image Error");
            }
          }
        },
      }),
    ],
    content: initialContent || "",

    onUpdate({ editor }) {
      let html = editor.getHTML();

      if (getHtmlData) {
        getHtmlData(html);
      }
    },
    editorProps: {
      attributes: {
        class: `p-2 focus:outline-none whitespace-pre-wrap`,
      },
      // Add custom paste handler
      handlePaste: (view, event, slice) => {
        const { state, dispatch } = view;
        const { tr } = state;
        const { from, to } = state.selection;

        // Get the pasted content
        const content = slice.content;

        // Create a new transaction to insert the content with formatting
        const newTr = tr.replaceWith(from, to, content);

        // Apply bold and font size formatting to the pasted content
        const pastedFrom = from;
        const pastedTo = from + content.size;

        // Apply bold formatting
        newTr.addMark(pastedFrom, pastedTo, state.schema.marks.bold.create());

        // Apply font size formatting (16px as default)
        newTr.addMark(
          pastedFrom,
          pastedTo,
          state.schema.marks.textStyle.create({ fontSize: "16px" })
        );

        dispatch(newTr);
        return true;
      },
    },

    injectCSS: false,
  });

  useEffect(() => {
    if (editor) {
      if (initialContent && !isInitialContentSet) {
        const cleanText = initialContent;
        editor.commands.setContent(cleanText, false, {
          preserveWhitespace: "full",
        });
        setIsInitialContentSet(true);
      }

      const handleFocus = () => setIsFocused(true);

      // Enhanced blur handler to prevent closing when math modal is open
      const handleBlur = (event) => {
        // Don't handle blur if math modal is open
        if (isMathModalOpen) {
          return;
        }

        // Check if the blur is happening because focus moved to:
        // 1. Toolbar elements
        // 2. Math modal elements
        // 3. MathLive virtual keyboard elements
        const relatedTarget = event.relatedTarget;

        if (
          relatedTarget &&
          (relatedTarget.closest(".toolbar") ||
            relatedTarget.closest(".math-modal") ||
            relatedTarget.closest("math-field") ||
            relatedTarget.closest(".ML__keyboard") ||
            relatedTarget.closest(".ML__virtual-keyboard") ||
            relatedTarget.tagName === "MATH-FIELD")
        ) {
          return;
        }

        // Additional check for MathLive elements that might not have proper class names
        if (
          relatedTarget &&
          (relatedTarget.getAttribute("role") === "button" ||
            relatedTarget.closest('[class*="ML__"]') ||
            relatedTarget.closest('[class*="mathlive"]'))
        ) {
          return;
        }

        setIsFocused(false);
      };

      editor.on("focus", handleFocus);
      editor.on("blur", handleBlur);

      const updateContent = () => {
        getHtmlData(editor.getHTML());
      };

      editor.on("update", updateContent);

      return () => {
        editor.off("focus", handleFocus);
        editor.off("blur", handleBlur);
        editor.off("update", updateContent);
      };
    }
  }, [
    editor,
    getHtmlData,
    initialContent,
    isInitialContentSet,
    isMathModalOpen,
  ]);

  if (!editor) return null;

  const handleToggleBold = () => editor.chain().focus().toggleBold().run();
  const handleToggleItalic = () => editor.chain().focus().toggleItalic().run();
  const handleToggleUnderline = () =>
    editor.chain().focus().toggleUnderline().run();
  const handleToggleHeadingOptions = () =>
    setHeadingOptionOpen((prev) => !prev);
  const handleToggleFontSizeOptions = () => setFontSizeOpen((prev) => !prev);

  const handleHeadingLevel = (level) =>
    editor.chain().focus().toggleHeading({ level }).run();

  const handleSetFontSize = (size) =>
    editor.chain().focus().setFontSize(size).run();
  const handleUnsetFontSize = () =>
    editor.chain().focus().unsetFontSize().run();

  const handleToggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const handleToggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const handleToggleSubscript = () =>
    editor.chain().focus().toggleSubscript().run();
  const handleToggleSuperscript = () =>
    editor.chain().focus().toggleSuperscript().run();

  const handleSetFontFamily = (font) =>
    editor.chain().focus().setFontFamily(font).run();
  const handleUnsetFontFamily = () =>
    editor.chain().focus().unsetFontFamily().run();

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    let url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    const isAbsolute = /^(https?:\/\/)/i.test(url);
    if (!isAbsolute) {
      url = "https://" + url;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  };

  const handleInsertSymbol = (latex) => {
    if (!editor) return;

    if (editor.isActive("equation")) {
      // Update existing equation
      editor.chain().focus().updateAttributes("equation", { latex }).run();
    } else {
      // Insert new equation
      editor
        .chain()
        .focus()
        .insertContent({
          type: "equation",
          attrs: {
            latex,
          },
        })
        .run();
    }

    setIsMathModalOpen(false);
  };

  // Enhanced modal close handler
  const handleMathModalClose = () => {
    setIsMathModalOpen(false);
    // Re-focus the editor after modal closes
    setTimeout(() => {
      if (editor) {
        editor.commands.focus();
      }
    }, 100);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full border border-gray-300 rounded-md">
      {isFocused && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="toolbar sticky top-0 bg-gray-50 z-50 flex flex-wrap justify-center items-center gap-2 px-2 py-1 border-b border-b-gray-200 w-full"
        >
          <div className="flex justify-between items-center gap-[2px]">
            <button
              onClick={handleToggleBold}
              className={editor.isActive("bold") ? "is-active" : "not-active"}
            >
              <Bold className="h-4 md:h-5" />
            </button>
            <button
              onClick={handleToggleItalic}
              className={editor.isActive("italic") ? "is-active" : "not-active"}
            >
              <Italic className="h-4 md:h-5" />
            </button>
            <button
              onClick={handleToggleUnderline}
              className={
                editor.isActive("underline") ? "is-active" : "not-active"
              }
            >
              <ULIcon className="h-4 md:h-5" />
            </button>
            <div className="relative flex justify-between items-center">
              <button
                onClick={handleToggleHeadingOptions}
                className="flex border rounded-md border-gray-300 p-[1px] "
              >
                <HIcon className="h-4 md:h-5" />
                {headingOptionOpen ? (
                  <ChevronUp className="h-4 md:h-5" />
                ) : (
                  <ChevronDown className="h-4 md:h-5" />
                )}
              </button>
              {headingOptionOpen && (
                <div className="absolute flex flex-col justify-between items-center top-7 z-10 border rounded-md border-gray-300 bg-gray-50 p-1">
                  <button
                    onClick={() => handleHeadingLevel(1)}
                    className={
                      editor.isActive("heading", { level: 1 })
                        ? "is-active"
                        : "not-active"
                    }
                  >
                    <Heading1 className="h-4 md:h-5" />
                  </button>
                  <button
                    onClick={() => handleHeadingLevel(2)}
                    className={
                      editor.isActive("heading", { level: 2 })
                        ? "is-active"
                        : "not-active"
                    }
                  >
                    <Heading2 className="h-4 md:h-5" />
                  </button>
                  <button
                    onClick={() => handleHeadingLevel(3)}
                    className={
                      editor.isActive("heading", { level: 3 })
                        ? "is-active"
                        : "not-active"
                    }
                  >
                    <Heading3 className="h-4 md:h-5" />
                  </button>
                  <button
                    onClick={() => handleHeadingLevel(4)}
                    className={
                      editor.isActive("heading", { level: 4 })
                        ? "is-active"
                        : "not-active"
                    }
                  >
                    <Heading4 className="h-4 md:h-5" />
                  </button>
                  <button
                    onClick={() => handleHeadingLevel(5)}
                    className={
                      editor.isActive("heading", { level: 5 })
                        ? "is-active"
                        : "not-active"
                    }
                  >
                    <Heading5 className="h-4 md:h-5" />
                  </button>
                  <button
                    onClick={() => handleHeadingLevel(6)}
                    className={
                      editor.isActive("heading", { level: 6 })
                        ? "is-active"
                        : "not-active"
                    }
                  >
                    <Heading6 className="h-4 md:h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <hr className="hidden lg:block bg-gray-300 h-10 w-[1px]"></hr>
          <div className="flex justify-between items-center gap-[2px]">
            <div className="relative flex justify-between items-center">
              <button
                onClick={handleToggleFontSizeOptions}
                className="flex border rounded-md border-gray-300 p-[1px] "
              >
                <ALargeSmall className="h-4 md:h-5" />
                {fontSizeOpen ? (
                  <ChevronUp className="h-4 md:h-5" />
                ) : (
                  <ChevronDown className="h-4 md:h-5" />
                )}
              </button>
              {fontSizeOpen && (
                <div className="absolute font-bold flex flex-col justify-between items-center top-7 z-10 border rounded-md border-gray-300 bg-gray-50 p-1">
                  {[
                    "8",
                    "9",
                    "10",
                    "12",
                    "14",
                    "16",
                    "18",
                    "20",
                    "24",
                    "28",
                    "36",
                    "48",
                    "72",
                  ].map((size) => (
                    <div key={size} className="flex gap-[2px]">
                      <button
                        onClick={() => handleSetFontSize(size)}
                        className={
                          editor.isActive("textStyle", {
                            fontSize: `${size}px`,
                          })
                            ? "is-active"
                            : "not-active"
                        }
                      >
                        {size}
                      </button>
                      <button
                        onClick={handleUnsetFontSize}
                        className="hover:bg-gray-300 rounded-sm"
                      >
                        <X className="h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleToggleOrderedList}
              className={
                editor.isActive("orderedList") ? "is-active" : "not-active"
              }
            >
              <ListOrdered className="h-4 md:h-5" />
            </button>
            <button
              onClick={handleToggleBulletList}
              className={
                editor.isActive("bulletList") ? "is-active" : "not-active"
              }
            >
              <LIIcon className="h-4 md:h-5" />
            </button>
            <button
              onClick={handleToggleSubscript}
              className={
                editor.isActive("subscript") ? "is-active" : "not-active"
              }
            >
              <SUBIcon className="h-4 md:h-5" />
            </button>
            <button
              onClick={handleToggleSuperscript}
              className={
                editor.isActive("superscript") ? "is-active" : "not-active"
              }
            >
              <SUPIcon className="h-4" />
            </button>
            <div className="relative flex justify-between items-center border border-gray-400 rounded-md">
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={
                  editor.isActive({ textAlign: "left" }) ? "is-active" : ""
                }
              >
                <AlignLeft className="h-4 md:h-5" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={
                  editor.isActive({ textAlign: "center" }) ? "is-active" : ""
                }
              >
                <AlignCenter className="h-4 md:h-5" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={
                  editor.isActive({ textAlign: "right" }) ? "is-active" : ""
                }
              >
                <AlignRight className="h-4 md:h-5" />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                className={
                  editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
                }
              >
                <AlignJustify className="h-4 md:h-5" />
              </button>
              <button
                onClick={() => editor.chain().focus().unsetTextAlign().run()}
              >
                <X className="h-4 md:h-5" />
              </button>
            </div>
          </div>
          <hr className="hidden lg:block bg-gray-300 h-10 w-[1px]"></hr>
          <div className="relative flex justify-between items-center gap-[2px]">
            <button
              onClick={setLink}
              className={editor.isActive("link") ? "is-active" : "not-active"}
            >
              <Link2 className="h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
            >
              <Link2Off className="h-4" />
            </button>
            <div className="flex justify-center items-center cursor-pointer bg-gray-50 text-black p-1 rounded-lg border border-gray-300 border-dashed hover:bg-blue-50">
              <button
                onClick={() => handleSetFontFamily("LMG ArunA")}
                className={
                  editor.isActive("textStyle", { fontFamily: "LMG ArunA" })
                    ? "is-active"
                    : "not-active"
                }
              >
                Guj
              </button>
              <button onClick={handleUnsetFontFamily}>
                <X className="h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsMathModalOpen(true)}
            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
          >
            M
          </button>
          <TableActions editor={editor} />
        </div>
      )}
      <div className={`w-full overflow-y-auto`}>
        <EditorContent editor={editor} className="tiptap" />
      </div>
      <MathModal
        isOpen={isMathModalOpen}
        onClose={handleMathModalClose}
        onInsertSymbol={handleInsertSymbol}
      />
    </div>
  );
};

export default Tiptap;
