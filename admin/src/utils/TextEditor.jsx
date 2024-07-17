/* eslint-disable react/prop-types */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSize } from "./fontSizeExtension";
import { CustomImage } from "./TipTapImage";
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
  Link2,
  Link2Off,
  ImageIcon,
  Trash2,
  Loader,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../url";
import axios from "axios";

const Tiptap = ({ placeholder, getHtmlData, initialContent }) => {
  const [showToolBar, setShowToolBar] = useState(true);
  const [headingOptionOpen, setHeadingOptionOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      Placeholder.configure({ placeholder }),
      StarterKit,
      Underline,
      Link,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      // Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
      FontFamily,
      CustomImage,
    ],
    content: initialContent || "",
    onUpdate({ editor }) {
      getHtmlData(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `p-2 focus:outline-none`,
      },
    },
  });

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

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `${API_URL}/admin/courses/uplodecourseimage.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      // console.log(response.data);
      if (response.status === 200) {
        editor.chain().focus().setImage({ src: response.data.url }).run();
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    const { from, to } = editor.view.state.selection;
    const tr = editor.view.state.tr;

    editor.view.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        tr.delete(pos, pos + node.nodeSize);
      }
    });

    editor.view.dispatch(tr);
    editor.chain().focus().run();
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-2 gap-2">
      <div className="flex gap-1 justify-start items-center h-10 w-full">
        <div
          onClick={() => setShowToolBar((prev) => !prev)}
          className="flex justify-center items-center z-30 border rounded-full py-1 md:p-[2px] border-gray-300 cursor-pointer"
        >
          {showToolBar ? (
            <Minus color="#475569" className="h-4 md:h-6" />
          ) : (
            <Plus color="#475569" className="h-4 md:h-6" />
          )}
        </div>
        {showToolBar && (
          <div className="flex flex-col flex-wrap md:flex-row justify-center lg:justify-between items-center z-30 lg:border lg:border-gray-300 gap-[6px] lg:rounded-lg px-[2px]">
            <div className="flex justify-between items-center gap-[2px]">
              <button
                onClick={handleToggleBold}
                className={editor.isActive("bold") ? "is-active" : "not-active"}
              >
                <Bold className="h-4 md:h-5" />
              </button>
              <button
                onClick={handleToggleItalic}
                className={
                  editor.isActive("italic") ? "is-active" : "not-active"
                }
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
              <div className="flex justify-center items-center">
                <input
                  id="fileinput"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                {loading ? (
                  <div className="flex justify-center items-center cursor-pointer bg-gray-50 text-black p-1 rounded-lg border border-gray-300 border-dashed hover:bg-blue-50">
                    <Loader className="animate-spin h-4 w-4" />
                  </div>
                ) : (
                  <label
                    htmlFor="fileinput"
                    className="flex justify-center items-center cursor-pointer bg-gray-50 text-black p-1 rounded-lg border border-gray-300 border-dashed hover:bg-blue-50"
                  >
                    <ImageIcon className="h-4" />
                  </label>
                )}
                <button onClick={handleRemoveImage}>
                  <Trash2 className="h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`w-full border border-gray-300 rounded-md overflow-y-auto`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
