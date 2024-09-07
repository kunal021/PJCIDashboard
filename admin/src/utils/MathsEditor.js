import { Node } from "@tiptap/core";
import katex from "katex";
import { mergeAttributes } from "@tiptap/react";

const MathEditor = Node.create({
  name: "equation",

  group: "inline", // This makes it inline so it can appear within a line of text

  inline: true, // Ensures that the node is inline

  selectable: true, // Allows selection of the node

  draggable: false, // Prevents dragging unless you want to allow it

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
        tag: "equation",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["equation", mergeAttributes(HTMLAttributes), HTMLAttributes.latex];
  },

  renderText({ node }) {
    return node.attrs.latex;
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("span"); // Use <span> for inline behavior
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
