import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import Update from "./Update";
import Add from "./Add";
import { truncateData } from "@/utils/truncateData";
import { IndianRupee, UserRound } from "lucide-react";
import getPercentage from "@/utils/getPercentage";
import { useHeading } from "@/hooks/use-heading";
import { useIsMobile } from "@/hooks/use-mobile";

const fetchData = async (setLoading, setBook) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}/admin/book/getallbook.php`);
    if (response.status === 200) {
      setBook(response.data.data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetBooks() {
  const { setHeading } = useHeading();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);

  const [book, setBook] = useState([]);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">Books</h1>
        <Add setBook={setBook} />
      </div>
    );
    fetchData(setLoading, setBook);
  }, [setHeading]);

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/book/deletebook.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 200) {
        const newBook = book.filter((book) => book.id !== id);
        setBook(newBook);
        toast.success("Document Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Error while deleting document"
      );
    }
  };

  const handleChangeStatus = async (bookId, is_active) => {
    const confirmAlert = window.confirm(
      `${
        is_active === "1"
          ? "Document will become Inactive. Do you want to proceed"
          : "Document will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("id", bookId);
        formData.append("status", is_active);
        await axios.post(
          `${API_URL}/admin/book/updatebookstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        const updatedBook = book.map((book) =>
          book.id === bookId ? { ...book, is_active } : book
        );
        setBook(updatedBook);
      } catch (error) {
        console.log("Error updating Book status:", error);

        toast.error(
          error?.response?.data?.message || "Error updating Book status"
        );
      }
    }
  };

  // const renderData = (data) => {
  //   if (typeof data === "string") {
  //     return LatexParser(data);
  //   }
  //   return data;
  // };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-full sm:w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex justify-center items-center">
              {book && book.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-4 w-full">
                  {book.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col w-44 sm:w-64 border rounded-lg border-gray-300 shadow-md my-5 p-3 gap-4 bg-white"
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center w-full">
                        {/* Status Section */}
                        <div className="flex flex-col items-center">
                          <p
                            className={`text-xs font-bold ${
                              item.is_active === "1"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {item.is_active === "1" ? "Public" : "Private"}
                          </p>
                          <button
                            onClick={() => {
                              handleChangeStatus(item.id, item.is_active);
                            }}
                            className="toggle-switch scale-[60%] sm:scale-75"
                          >
                            <input
                              type="checkbox"
                              checked={item.is_active === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Update data={item} setData={setBook} />
                          <ConfirmDelete
                            handleClick={() => handleDelete(item.id)}
                          />
                        </div>
                      </div>

                      {/* Image Section */}
                      <div className="flex justify-center items-center">
                        <img
                          src={item.img_url}
                          alt="Book Cover"
                          className="rounded-md border border-gray-200 h-40 sm:h-64 w-full"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {isMobile
                            ? truncateData(item.name, 3)
                            : truncateData(item.name, 5)}
                        </h3>
                        {/* <p className="text-xs text-gray-600 truncate">
                          {isMobile
                            ? truncateData(renderData(item.description), 3)
                            : truncateData(renderData(item.description), 5)}
                        </p> */}
                      </div>

                      {/* Footer Section */}
                      <div className="flex flex-wrap justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-green-500" />
                          <span>{item.price}</span>
                          <span className="line-through text-gray-500 text-sm">
                            {item.original_price}
                          </span>
                          {item.original_price && item.price && (
                            <span className="text-green-500 text-sm">
                              {getPercentage(item.original_price, item.price)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserRound className="h-4 w-4 text-blue-500" />
                          <span>{item.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-2xl font-bold text-center mt-20">
                  No Data Available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GetBooks;
