import { useIsMobile } from "@/hooks/use-mobile";
import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";

const Pagination = ({ totalPage, currPage, setCurrPage }) => {
  const isMobile = useIsMobile();
  const [inputPage, setInputPage] = useState("");

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPage) {
      setCurrPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = () => {
    const page = Number(inputPage);
    if (page < 1 || page > totalPage) {
      toast.error("Please enter a valid page number");
      return;
    }
    setCurrPage(page);
    setInputPage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = isMobile ? 1 : 2;

    if (totalPage <= 3) {
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currPage > visiblePages + 1) {
        pageNumbers.push("...");
      }

      // Show current page and adjacent pages
      for (let i = currPage - visiblePages; i <= currPage + visiblePages; i++) {
        if (i > 1 && i < totalPage) {
          pageNumbers.push(i);
        }
      }

      if (currPage < totalPage - visiblePages) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPage);
    }

    return [...new Set(pageNumbers)]; // Remove duplicates
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex bg-white rounded-lg">
        {/* Previous button */}
        <button
          onClick={() => handlePageClick(currPage - 1)}
          disabled={currPage === 1}
          className="h-10 border-2 border-r-0 border-gray-300 px-2 sm:px-3 rounded-l-lg hover:bg-gray-300 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-inherit"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex">
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() =>
                pageNumber !== "..." && handlePageClick(pageNumber)
              }
              disabled={pageNumber === "..."}
              className={`h-10 border-2 border-r-0 border-gray-300 hover:bg-gray-300 hover:text-white 
                ${pageNumber === "..." ? "w-8" : "w-10"} 
                ${currPage === pageNumber ? "bg-gray-300 text-black" : ""}
                ${pageNumber === "..." ? "cursor-default" : "cursor-pointer"}
                disabled:hover:bg-white disabled:hover:text-inherit
                text-sm sm:text-base`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageClick(currPage + 1)}
          disabled={currPage === totalPage}
          className="h-10 border-2 border-gray-300 px-2 sm:px-3 rounded-r-lg hover:bg-gray-300 hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-inherit"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      {/* Go to page input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="h-10 w-16 text-center border-2 border-gray-300 rounded-lg text-sm"
          value={inputPage}
          onChange={handleInputChange}
          placeholder="Page"
          min="1"
          max={totalPage}
        />
        <button
          onClick={handleInputSubmit}
          className="h-10 px-3 sm:px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-300 hover:text-white text-sm"
        >
          Go
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  totalPage: PropTypes.number.isRequired,
  currPage: PropTypes.number.isRequired,
  setCurrPage: PropTypes.func.isRequired,
};

export default Pagination;
