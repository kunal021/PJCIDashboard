import { Node } from "@tiptap/core";
import katex from "katex";
import { mergeAttributes } from "@tiptap/react";

const MathEditor = Node.create({
  name: "equation",

  group: "inline", // This makes it inline so it can appear within a line of text
  inline: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      latex: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-type='equation']", // Use span with a data-type to distinguish it
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-type": "equation" }),
      HTMLAttributes.latex,
    ];
  },

  renderText({ node }) {
    return node.attrs.latex;
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("span");
      const equationContainer = document.createElement("span");

      try {
        katex.render(node.attrs.latex, equationContainer, {
          throwOnError: false,
        });
      } catch (e) {
        equationContainer.textContent = `Invalid LaTeX: ${node.attrs.latex}`;
      }

      dom.appendChild(equationContainer);
      return {
        dom,
      };
    };
  },
});

export default MathEditor;
