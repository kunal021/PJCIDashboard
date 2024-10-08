import parser from "html-react-parser";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export const LatexParser = (htmlString) => {
  return parser(htmlString, {
    replace: (domNode) => {
      if (
        domNode.name === "span" &&
        domNode.attribs &&
        domNode.attribs["data-type"] === "equation"
      ) {
        const latexString = domNode.attribs["latex"];
        if (!latexString) return null;

        const isBlock =
          latexString.startsWith("\\[") && latexString.endsWith("\\]");
        const isInline =
          latexString.startsWith("\\(") && latexString.endsWith("\\)");

        const cleanedLatex = latexString
          .replace(/^\\\[|\\\]$/g, "")
          .replace(/^\\\(|\\\)$/g, "")
          .trim();

        return isBlock ? (
          <BlockMath>{cleanedLatex}</BlockMath>
        ) : isInline ? (
          <InlineMath>{cleanedLatex}</InlineMath>
        ) : (
          <InlineMath>{latexString}</InlineMath>
        );
      }

      return null;
    },
  });
};
