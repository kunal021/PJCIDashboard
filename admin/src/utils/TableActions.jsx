/* eslint-disable react/prop-types */
import { Table } from "lucide-react";
import { useState } from "react";

const TableActions = ({ editor }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!editor) return null;

  const handleAction = (action) => {
    action();
    setShowMenu(false); // Close the menu
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-blue-500 text-white font-bold py-1 px-2 rounded"
      >
        <Table className="h-4 md:h-5" />
      </button>
      {showMenu && (
        <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded shadow-lg w-48 h-40 overflow-y-auto">
          <button
            onClick={() =>
              handleAction(() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              )
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Insert table
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().deleteTable().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Delete table
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().addColumnBefore().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Add column before
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().addColumnAfter().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Add column after
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().deleteColumn().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Delete column
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().addRowBefore().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Add row before
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().addRowAfter().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Add row after
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().deleteRow().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Delete row
          </button>
          <button
            onClick={() =>
              handleAction(() =>
                editor.chain().focus().toggleHeaderColumn().run()
              )
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Toggle header column
          </button>
          <button
            onClick={() =>
              handleAction(() => editor.chain().focus().toggleHeaderRow().run())
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Toggle header row
          </button>
          <button
            onClick={() =>
              handleAction(() =>
                editor.chain().focus().toggleCellBorder().run()
              )
            }
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
          >
            Toggle Cell Border
          </button>
        </div>
      )}
    </div>
  );
};

export default TableActions;
