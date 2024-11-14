import { TableCell } from "@tiptap/extension-table-cell";

export const CustomTableCell = TableCell.extend({
  addCommands() {
    return {
      toggleCellBorder:
        () =>
        ({ commands }) => {
          const toggleBorderStyle = (borderStyle) =>
            borderStyle === "none" ? "1px solid #ccc" : "none";

          return commands.updateAttributes("tableCell", {
            style: (cell) => {
              const borderStyle = cell.style.border || "1px solid #ccc";
              return `border: ${toggleBorderStyle(borderStyle)};`;
            },
          });
        },
    };
  },
});
