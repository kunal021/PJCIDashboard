import katex from "katex";
import { useState } from "react";
import { mathSymbols } from "./MathSymbol";

/* eslint-disable react/prop-types */
const MathModal = ({ isOpen, onClose, onInsertSymbol }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [latexCode, setLatexCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Basic Maths");

  const handleSymbolClick = (item) => {
    setSelectedSymbol(item);
    setLatexCode(item.latex);
  };

  const handleLatexChange = (e) => {
    setLatexCode(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter symbols by the selected category
  const filteredSymbols = mathSymbols.filter(
    (item) => item.category === selectedCategory
  );

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ml-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-[700px] mx-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select Math Symbol
        </h2>

        {/* Category selection */}
        <div className="mb-4">
          <label htmlFor="category" className="block font-medium mb-2">
            Select Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded"
          >
            <option value="Basic Maths">Basic Maths</option>
            <option value="Relations">Relations</option>
            <option value="Greek Letters">Greek Letters</option>
            <option value="Operators">Operators</option>
            <option value="Arrows">Arrows</option>
            <option value="Geometry">Geometry</option>
            <option value="Structures">Structures</option>
          </select>
        </div>

        {/* Display symbols */}
        <div className="mb-2 h-40 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {filteredSymbols.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSymbolClick(item)}
                className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200"
              >
                {item.symbol}
              </button>
            ))}
          </div>
        </div>

        {selectedSymbol && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <div className="border p-4 mb-2">
              {(() => {
                try {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: katex.renderToString(latexCode),
                      }}
                    />
                  );
                } catch (error) {
                  console.error("Invalid LaTeX input:", error);
                  return (
                    <p className="text-red-500">
                      Invalid LaTeX code. Please correct it.
                    </p>
                  );
                }
              })()}
            </div>
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

export default MathModal;
