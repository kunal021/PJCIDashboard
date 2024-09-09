import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";

const Pagination = ({ totalPage, currPage, setCurrPage }) => {
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
    }
    if (page >= 1 && page <= totalPage) {
      setCurrPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = 2;

    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1, 2);

      if (currPage > visiblePages + 1) {
        pageNumbers.push("...");
      }

      for (let i = currPage - visiblePages; i <= currPage + visiblePages; i++) {
        if (i > 2 && i < totalPage - 1) {
          pageNumbers.push(i);
        }
      }

      if (currPage < totalPage - visiblePages) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPage - 1, totalPage);
    }

    return pageNumbers;
  };

  return (
    <div className="flex bg-white rounded-lg">
      <button
        onClick={() => handlePageClick(currPage - 1)}
        disabled={currPage === 1}
        className="h-10 border-2 border-r-0 border-gray-300 px-3 rounded-l-lg hover:bg-gray-300 hover:text-white"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </button>

      {getPageNumbers().map((pageNumber, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(pageNumber)}
          disabled={pageNumber === "..."}
          className={`h-10 border-2 border-r-0 border-gray-300 hover:bg-gray-300 hover:text-white w-10 ${
            currPage === pageNumber && "bg-gray-300 text-black"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currPage + 1)}
        disabled={currPage === totalPage}
        className="h-10 border-2 border-gray-300 px-3 rounded-r-lg hover:bg-gray-300 hover:text-white"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </button>

      {/* Input field to go directly to a specific page */}
      <div className="ml-4 flex items-center">
        <input
          type="number"
          className="h-10 w-16 text-center border-2 border-gray-300 rounded-lg"
          value={inputPage}
          onChange={handleInputChange}
          placeholder="Go to"
        />
        <button
          onClick={handleInputSubmit}
          className="ml-2 h-10 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-300 hover:text-white"
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
