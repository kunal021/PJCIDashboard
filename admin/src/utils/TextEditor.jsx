

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from '@tiptap/extension-font-family'
import { FontSize } from "./fontSizeExtension";
import {
    Bold,
    Code,
    Italic,
    ListOrdered,
    Strikethrough,
    Underline as ULIcon,
    List as LIIcon,
    Link2,
    Link2Off,
    Subscript as SUBIcon,
    Superscript as SUPIcon,
    Highlighter,
    Square,
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
} from "lucide-react";
import { useState } from "react";

const RichTextEditor = () => {
    const [headingOptionOpen, setHeadingOptionOpen] = useState(false);
    const [fontSizeOpen, setFontSizeOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Link,
            OrderedList,
            Subscript,
            Superscript,
            Highlight.configure({ multicolor: true }),
            ListItem,
            CodeBlock,
            Image,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TextStyle,
            FontSize,
            FontFamily
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

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen p-4 space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-center space-x-2 z-30">
                <div className="flex justify-between items-center space-x-2">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive("bold") ? "is-active" : "not-active"}
                    >
                        <Bold />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive("italic") ? "is-active" : "not-active"}
                    >
                        <Italic />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={
                            editor.isActive("underline") ? "is-active" : "not-active"
                        }
                    >
                        <ULIcon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive("strike") ? "is-active" : "not-active"}
                    >
                        <Strikethrough />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={
                            editor.isActive("codeBlock") ? "is-active" : "not-active"
                        }
                    >
                        <Code />
                    </button>
                    <div className="relative flex justify-between items-center space-y-1">
                        <button
                            onClick={handleHeadingOptions}
                            className="flex border-2 rounded-md border-black p-[1px] "
                        >
                            <HIcon /> {headingOptionOpen ? <ChevronUp /> : <ChevronDown />}
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
                                    <Heading1 />
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
                                    <Heading2 />
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
                                    <Heading3 />
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
                                    <Heading4 />
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
                                    <Heading5 />
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
                                    <Heading6 />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <hr className="hidden lg:block bg-gray-500 h-8 w-[2px]"></hr>
                <div className="flex justify-between items-center space-x-2">
                    <div className="relative flex justify-between items-center space-y-1">
                        <button
                            onClick={handleFontSizeOptions}
                            className="flex border-2 rounded-md border-black p-[1px] "
                        >
                            <ALargeSmall /> {fontSizeOpen ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {fontSizeOpen && (
                            <div className="absolute font-bold flex flex-col justify-between items-center top-7 -left-[5px] border-2 rounded-md border-black bg-gray-100 p-1">
                                {fontSizeArray.map((size) => (
                                    <div key={size} className="flex gap-[2px]">
                                        <button
                                            onClick={() => setFontSize(size)}
                                            className={
                                                editor.isActive("textStyle", { fontSize: `${size}px` })
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
                                            <X className="h-4" />
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
                        <ListOrdered />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={
                            editor.isActive("bulletList") ? "is-active" : "not-active"
                        }
                    >
                        <LIIcon />
                    </button>
                    <button
                        onClick={setLink}
                        className={editor.isActive("link") ? "is-active" : "not-active"}
                    >
                        <Link2 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        disabled={!editor.isActive("link")}
                    >
                        <Link2Off />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={
                            editor.isActive("subscript") ? "is-active" : "not-active"
                        }
                    >
                        <SUBIcon />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={
                            editor.isActive("superscript") ? "is-active" : "not-active"
                        }
                    >
                        <SUPIcon />
                    </button>
                </div>
                <hr className="hidden lg:block bg-gray-500 h-8 w-[2px]"></hr>
                <div className="flex justify-between items-center space-x-1">
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={
                            editor.isActive("highlight") ? "is-active" : "not-active"
                        }
                    >
                        <Highlighter />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#fb923c" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#fb923c" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-orange-400 fill-orange-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#fbbf24" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#fbbf24" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-amber-400 fill-amber-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#f87171" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#f87171" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-red-400 fill-red-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#facc15" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#facc15" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-yellow-400 fill-yellow-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#a3e635" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#a3e635" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-lime-400 fill-lime-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#4ade80" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#4ade80" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-green-400 fill-green-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#38bdf8" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#38bdf8" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-sky-400 fill-sky-400" />
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleHighlight({ color: "#60a5fa" }).run()
                        }
                        className={
                            editor.isActive("highlight", { color: "#60a5fa" })
                                ? "is-active"
                                : "not-active"
                        }
                    >
                        <Square className="text-blue-400 fill-blue-400" />
                    </button>
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
                        LMG ArunA
                    </button>
                    <button onClick={() => editor.chain().focus().unsetFontFamily().run()}>
                        <X className="h-5" />
                    </button>
                </div>
            </div>
            <div className="w-full border border-gray-300 rounded-md">
                <EditorContent editor={editor} />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save
            </button>
        </div>
    );
};

export default RichTextEditor;
