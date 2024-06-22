/* eslint-disable react/prop-types */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
// import ListItem from "@tiptap/extension-list-item";
// import OrderedList from "@tiptap/extension-ordered-list";
// import Heading from "@tiptap/extension-heading";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
// import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSize } from "./fontSizeExtension";
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
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";

const Tiptap = ({ placeholder, getHtmlData }) => {
  const [headingOptionOpen, setHeadingOptionOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [showToolBar, setShowToolBar] = useState(false);
  // const [markerOpen, setMarkerOpen] = useState(false);

  // const divRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (divRef.current && !divRef.current.contains(event.target as Node)) {
  //       setShowToolBar(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [divRef]);

  const editor = useEditor({
    extensions: [
      Placeholder.configure({
        placeholder: placeholder,
      }),
      StarterKit,
      Underline,
      //   Heading.configure({
      //     levels: [1, 2, 3, 4, 5, 6],
      //   }),
      Link,
      //   OrderedList,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      //   ListItem,
      //   CodeBlock,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      FontSize,
      FontFamily,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-2 h-80 focus:outline-none",
      },
    },
    content: ``,
  });

  if (!editor) {
    return null;
  }

  const fontSizeArray = [
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
  ];

  const setFontSize = (size) => {
    editor.chain().focus().setFontSize(size).run();
  };
  const unSetFontSize = () => {
    editor.chain().focus().unsetFontSize().run();
  };

  const handleHeadingOptions = () => {
    setHeadingOptionOpen((prev) => !prev);
  };

  const handleFontSizeOptions = () => {
    setFontSizeOpen((prev) => !prev);
  };

  // const handleMarkerOpen = () => {
  //     setMarkerOpen((prev) => !prev);
  // };

  getHtmlData(editor.getHTML());

  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-4 space-y-5">
      <div className="flex space-x-2 justify-start items-center h-10 w-full">
        <div
          onClick={() => setShowToolBar((prev) => !prev)}
          className="flex justify-center items-center z-30 border-2 rounded-full py-1 md:py-0 md:p-1 border-black cursor-pointer"
        >
          {showToolBar ? (
            <Minus className="h-4 md:h-8" />
          ) : (
            <Plus className="h-4 md:h-8" />
          )}
        </div>
        {showToolBar && (
          <div className="flex flex-col flex-wrap md:flex-row justify-center lg:justify-between items-start z-30 lg:border-2 lg:border-black space-y-1 md:space-x-4 md:space-y-0 lg:rounded-lg px-2 py-[2px]">
            <div className="flex justify-between items-center space-x-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : "not-active"}
              >
                <Bold className="h-4 md:h-8" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={
                  editor.isActive("italic") ? "is-active" : "not-active"
                }
              >
                <Italic className="h-4 md:h-8" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={
                  editor.isActive("underline") ? "is-active" : "not-active"
                }
              >
                <ULIcon className="h-4 md:h-8" />
              </button>

              <div className="relative flex justify-between items-center space-y-1">
                <button
                  onClick={handleHeadingOptions}
                  className="flex border-2 rounded-md border-black p-[1px] "
                >
                  <HIcon className="h-4 md:h-8" />
                  {headingOptionOpen ? (
                    <ChevronUp className="h-4 md:h-8" />
                  ) : (
                    <ChevronDown className="h-4 md:h-8" />
                  )}
                </button>
                {headingOptionOpen && (
                  <div className="absolute flex flex-col justify-between items-center top-7 left-[6px] border-2 rounded-md border-black bg-gray-100 p-1">
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                      className={
                        editor.isActive("heading", { level: 1 })
                          ? "is-active"
                          : "not-active"
                      }
                    >
                      <Heading1 className="h-4 md:h-8" />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      className={
                        editor.isActive("heading", { level: 2 })
                          ? "is-active"
                          : "not-active"
                      }
                    >
                      <Heading2 className="h-4 md:h-8" />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                      }
                      className={
                        editor.isActive("heading", { level: 3 })
                          ? "is-active"
                          : "not-active"
                      }
                    >
                      <Heading3 className="h-4 md:h-8" />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 4 }).run()
                      }
                      className={
                        editor.isActive("heading", { level: 4 })
                          ? "is-active"
                          : "not-active"
                      }
                    >
                      <Heading4 className="h-4 md:h-8" />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 5 }).run()
                      }
                      className={
                        editor.isActive("heading", { level: 5 })
                          ? "is-active"
                          : "not-active"
                      }
                    >
                      <Heading5 className="h-4 md:h-8" />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 6 }).run()
                      }
                      className={
                        editor.isActive("heading", { level: 6 })
                          ? "is-active"
                          : "not-active"
                      }
                    >
                      <Heading6 className="h-4 md:h-8" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <hr className="hidden lg:block bg-gray-500 h-8 w-[2px]"></hr>
            <div className="flex justify-between items-center space-x-1">
              <div className="relative flex justify-between items-center space-y-1">
                <button
                  onClick={handleFontSizeOptions}
                  className="flex border-2 rounded-md border-black p-[1px] "
                >
                  <ALargeSmall className="h-4 md:h-8" />
                  {fontSizeOpen ? (
                    <ChevronUp className="h-4 md:h-8" />
                  ) : (
                    <ChevronDown className="h-4 md:h-8" />
                  )}
                </button>
                {fontSizeOpen && (
                  <div className="absolute font-bold flex flex-col justify-between items-center top-7 -left-[5px] border-2 rounded-md border-black bg-gray-100 p-1">
                    {fontSizeArray.map((size) => (
                      <div key={size} className="flex gap-[2px]">
                        <button
                          onClick={() => setFontSize(size)}
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
                          onClick={unSetFontSize}
                          className="hover:bg-gray-300 rounded-sm"
                        >
                          <X className="h-3 md:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={
                  editor.isActive("orderedList") ? "is-active" : "not-active"
                }
              >
                <ListOrdered className="h-4 md:h-8" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={
                  editor.isActive("bulletList") ? "is-active" : "not-active"
                }
              >
                <LIIcon className="h-4 md:h-8" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={
                  editor.isActive("subscript") ? "is-active" : "not-active"
                }
              >
                <SUBIcon className="h-4 md:h-8" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={
                  editor.isActive("superscript") ? "is-active" : "not-active"
                }
              >
                <SUPIcon className="h-4 md:h-8" />
              </button>
            </div>
            <hr className="hidden lg:block bg-gray-500 h-8 w-[2px]"></hr>
            <div className="relative flex justify-between items-center space-y-1">
              <button
                onClick={() =>
                  editor.chain().focus().setFontFamily("LMG ArunA").run()
                }
                className={
                  editor.isActive("textStyle", { fontFamily: "LMG ArunA" })
                    ? "is-active"
                    : "not-active"
                }
              >
                Guj
              </button>
              <button
                onClick={() => editor.chain().focus().unsetFontFamily().run()}
              >
                <X className="h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={`w-full border border-gray-300 rounded-md`}>
        <EditorContent editor={editor} className="overflow-y-auto h-20" />
      </div>
    </div>
  );
};

export default Tiptap;
