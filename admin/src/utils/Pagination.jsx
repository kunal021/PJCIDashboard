import PropTypes from "prop-types";

const Pagination = ({ totalPage, currPage, setCurrPage }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPage) {
      setCurrPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = 1; // Number of pages to show around the current page

    if (totalPage <= 5) {
      // Show all pages if totalPage is less than or equal to 5
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first two pages
      pageNumbers.push(1, 2);

      // Add ellipsis if current page is further than visiblePages from the start
      if (currPage > visiblePages + 1) {
        pageNumbers.push("...");
      }

      // Show pages around the current page
      for (let i = currPage - visiblePages; i <= currPage + visiblePages; i++) {
        if (i > 2 && i < totalPage - 1) {
          pageNumbers.push(i);
        }
      }

      // Add ellipsis if current page is further than visiblePages from the end
      if (currPage < totalPage - visiblePages) {
        pageNumbers.push("...");
      }

      // Show last two pages
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
    </div>
  );
};

Pagination.propTypes = {
  totalPage: PropTypes.number.isRequired,
  currPage: PropTypes.number.isRequired,
  setCurrPage: PropTypes.func.isRequired,
};

export default Pagination;
