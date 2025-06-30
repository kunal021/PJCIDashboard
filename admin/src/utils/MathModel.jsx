/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { mathSymbols } from "./MathSymbol";
import "mathlive";

const SymbolButton = ({ latex, onClick }) => {
  const mathRef = useRef(null);

  const isComplexSymbol =
    latex.includes("sum") ||
    latex.includes("prod") ||
    latex.includes("int") ||
    latex.includes("lim") ||
    latex.includes("frac") ||
    latex.includes("sqrt") ||
    latex.includes("binom") ||
    latex.includes("overline") ||
    latex.includes("underline");

  useEffect(() => {
    if (mathRef.current) mathRef.current.value = latex;
  }, [latex]);

  return (
    <div className="relative bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 p-3 cursor-pointer">
      <math-field
        ref={mathRef}
        read-only
        style={{
          fontSize: isComplexSymbol ? "14px" : "16px",
          pointerEvents: "none",
          userSelect: "none",
          width: "100%",
          minHeight: isComplexSymbol ? "40px" : "30px",
        }}
      ></math-field>
      {/* Invisible clickable layer */}
      <div
        onClick={() => onClick(latex)}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

const MathModal = ({ isOpen, onClose, onInsertSymbol }) => {
  const [latexCode, setLatexCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Basic Maths");
  const modalRef = useRef(null);

  const handleSymbolClick = (item) => {
    const mf = document.getElementById("mathlive-editor");
    if (mf) mf.executeCommand("insert", item.latex);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredSymbols = mathSymbols.filter(
    (item) => item.category === selectedCategory
  );

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Prevent modal from closing when clicking inside
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const mf = document.getElementById("mathlive-editor");
    if (mf && isOpen) {
      mf.value = latexCode;

      const handleInput = (e) => {
        setLatexCode(e.target.value);
      };

      // Set up virtual keyboard configuration
      mf.setOptions({
        virtualKeyboardMode: "manual",
        smartMode: false,
        readOnly: false,
      });

      mf.addEventListener("input", handleInput);

      // Focus the math field after a short delay
      setTimeout(() => {
        mf.focus();
      }, 100);

      return () => {
        mf.removeEventListener("input", handleInput);
      };
    }
  }, [isOpen, latexCode]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="math-modal bg-white rounded-lg p-6 w-full max-w-[90%] md:max-w-[80%] max-h-[90%] overflow-y-auto mx-4 sm:mx-auto shadow-lg"
        onClick={handleModalClick}
      >
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
          Insert Math Formula
        </h2>

        <label className="block font-medium mb-2">Select Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="Basic Maths">Basic Maths</option>
          <option value="Relations">Relations</option>
          <option value="Greek Letters">Greek Letters</option>
          <option value="Operators">Operators</option>
          <option value="Arrows">Arrows</option>
          <option value="Geometry">Geometry</option>
          <option value="Structures">Structures</option>
        </select>

        <div className="mb-4">
          <label className="block font-medium mb-2">
            Click a symbol to insert
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 h-80 overflow-y-auto border border-gray-200 p-4 rounded bg-gray-50 auto-rows-min">
            {filteredSymbols.map((item, idx) => (
              <SymbolButton
                key={idx}
                latex={item.latex}
                onClick={() => handleSymbolClick(item)}
              />
            ))}
          </div>
        </div>

        {/* MathLive Editor */}
        <div className="mb-4">
          <math-field
            id="mathlive-editor"
            value={latexCode}
            virtual-keyboard-mode="manual"
            class="w-full border p-2 rounded text-lg mathlive-field"
            style={{ minHeight: "60px" }}
          ></math-field>
          <p className="text-sm text-gray-500 mt-2">
            You can edit the equation directly. Use the virtual keyboard or type
            LaTeX commands.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onInsertSymbol(latexCode)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onMouseDown={(e) => e.preventDefault()}
          >
            Insert
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onMouseDown={(e) => e.preventDefault()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathModal;
