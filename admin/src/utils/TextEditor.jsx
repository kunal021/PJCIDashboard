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
import CodeBlock from "@tiptap/extension-code-block";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL } from "../url";
import axios from "axios";
import MathEditor from "./MathsEditor";
import katex from "katex";

const MathModal = ({ isOpen, onClose, onInsertSymbol }) => {
  const mathSymbols = [
    { latex: "\\frac{a}{b}", symbol: "Fraction" },
    { latex: "\\sqrt{x}", symbol: "Square Root" },
    { latex: "\\int_{a}^{b} f(x)dx", symbol: "Integral" },
    // Add more symbols as needed
  ];

  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [latexCode, setLatexCode] = useState("");

  const handleSymbolClick = (item) => {
    setSelectedSymbol(item);
    setLatexCode(item.latex);
  };

  const handleLatexChange = (e) => {
    setLatexCode(e.target.value);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select Math Symbol
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {mathSymbols.map((item) => (
            <button
              key={item.latex}
              onClick={() => handleSymbolClick(item)}
              className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200"
            >
              {item.symbol}
            </button>
          ))}
        </div>
        {selectedSymbol && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <div
              className="border p-4 mb-2"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(latexCode),
              }}
            ></div>
            <textarea
              value={latexCode}
              onChange={handleLatexChange}
              className="w-full border p-2 rounded mb-2"
              rows="3"
            />
            <p className="text-sm text-gray-500">Edit LaTeX Code Above</p>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onInsertSymbol(latexCode)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Insert
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

const Tiptap = ({ placeholder, getHtmlData, initialContent }) => {
  const [headingOptionOpen, setHeadingOptionOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMathModalOpen, setMathModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      Placeholder.configure({ placeholder: placeholder || "Start typing..." }),
      StarterKit,
      Underline,
      CodeBlock,
      Link,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
      FontFamily,
      MathEditor,
      Mathematics,
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
          }
        },
        async onPaste(currentEditor, files, htmlContent) {
          for (const file of files) {
            if (htmlContent) {
              console.log(htmlContent);
              return false;
            }

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
          }
        },
      }),
    ],
    content: initialContent || "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      getHtmlData(html);
    },
    editorProps: {
      attributes: {
        class: `p-2 focus:outline-none`,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const handleFocus = () => setIsFocused(true);
      const handleBlur = (event) => {
        if (!event.relatedTarget?.closest(".toolbar")) {
          setIsFocused(false);
        }
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
  }, [editor, getHtmlData]);

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
    if (latex && editor) {
      // Insert an atomic equation node with the LaTeX content
      editor
        .chain()
        .focus()
        .insertContent({
          type: "equation",
          attrs: {
            latex, // Set the LaTeX code as an attribute
          },
        })
        .run();
    }

    // Close the modal after inserting the symbol
    setMathModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full border border-gray-300 rounded-md">
      {isFocused && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="sticky top-0 bg-gray-50 z-50 flex flex-wrap justify-center items-center gap-2 px-2 py-1 border-b border-b-gray-200 w-full"
        >
          <div className="flex justify-between items-center gap-[2px]">
            {/* <button onClick={() => insertMathSymbol("$\\frac{a}{b}$")}>
              F
            </button>
            <button onClick={() => insertMathSymbol("$\\sqrt{a^2 + b^2}$")}>
              R
            </button>
            <button onClick={() => insertMathSymbol("$\\int_{a}^{b} f(x)dx$")}>
              I
            </button>
            <button onClick={() => insertMathSymbol("$\\sqrt[n]{x}$")}>
              Root
            </button> */}
            <button
              onClick={() => setMathModalOpen(true)}
              className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              M
            </button>
            {/* <button
              onClick={() =>
                insertMathSymbol(
                  "$\\left\\{\\begin{matrix}x&\\text{if }x>0\\\\0&\\text{otherwise}\\end{matrix}\\right.$"
                )
              }
            >
              Fun
            </button> */}
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
            <div className="relative flex justify-between items-center space-y-1">
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
                <div className="absolute flex flex-col justify-between items-center top-7 left-[6px] border rounded-md border-gray-300 bg-gray-50 p-1">
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
            <div className="relative flex justify-between items-center space-y-1">
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
                <div className="absolute font-bold flex flex-col justify-between items-center top-7 -left-[5px] border rounded-md border-gray-300 bg-gray-50 p-1">
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
        </div>
      )}
      <div className={`w-full overflow-y-auto`}>
        <EditorContent editor={editor} />
      </div>
      <MathModal
        isOpen={isMathModalOpen}
        onClose={() => setMathModalOpen(false)}
        onInsertSymbol={handleInsertSymbol}
      />
    </div>
  );
};

export default Tiptap;
