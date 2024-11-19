import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import Update from "./Update";
import Add from "./Add";

const fetchData = async (
  setLoading,
  //   currentPage,
  setBook
  //   setPaginationData
) => {
  try {
    setLoading(true);
    // const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    // formData.append("type", 2);
    const response = await axios.post(
      `${API_URL}/admin/book/getallbook.php`
      //   formData,
      //   { headers: "content-type/form-data" }
    );
    setBook(response.data.data);
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetBooks() {
  const [loading, setLoading] = useState(false);
  //   const [paginationData, setPaginationData] = useState({});
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [updateVideo, setUpdateVideo] = useState(false);
  //   const [updateVideoData, setUpdateVideoData] = useState({});

  const [book, setBook] = useState([]);

  useEffect(() => {
    fetchData(
      setLoading,
      //  currentPage,
      setBook
      //  setPaginationData
    );
  }, []);

  const handleDelete = async (id) => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/book/deletebook.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 201) {
        // dispatch(deleteVideo(id));
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
    // finally {
    //   setLoading(false);
    // }
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

        // console.log(res);
        // Update local state instead of fetching users again
        const updatedBook = book.map((book) =>
          book.id === bookId ? { ...book, is_active } : book
        );
        setBook(updatedBook);
      } catch (error) {
        console.log("Error updating user status:", error);
        // Handle error (e.g., show an error message)
        toast.error(
          error?.response?.data?.message || "Error updating user status"
        );
      }
    }
  };

  // console.log(book);

  return (
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div
          className={`${"w-[80%] flex flex-col justify-center items-center mx-auto"} `}
        >
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex justify-center items-center gap-5">
              <h1 className="text-3xl font-bold text-center">Books List</h1>
              <Add book={book} setBook={setBook} />
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              {book.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {book.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-60 border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-2"
                    >
                      <div className="flex flex-col justify-center items-start gap-2 w-full">
                        <div className="flex justify-between items-center w-full gap-2 scale-[90%]">
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-xs font-bold">
                              {item.is_active === "1" ? "Public" : "Private"}
                            </p>
                            <button
                              onClick={() => {
                                handleChangeStatus(item.id, item.is_active);
                              }}
                              className="toggle-switch scale-75 align-middle"
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
                          <Update data={item} setData={setBook} />
                          <ConfirmDelete
                            handleClick={() => handleDelete(item.id)}
                          />
                        </div>

                        <div className="cursor-pointer flex flex-col justify-between items-center w-full gap-2">
                          <div className="flex justify-center items-center w-full">
                            <img
                              src={item.img_url}
                              className="rounded-lg border-transparent h-64 w-full"
                            />
                          </div>
                        </div>

                        <div className=" cursor-pointer flex justify-between items-center w-full gap-6">
                          Description: {item.description}
                        </div>
                        <div className="flex flex-wrap text-wrap w-full">
                          {item.name}
                        </div>

                        <div className=" cursor-pointer flex justify-between items-center w-full gap-6">
                          <div className="flex justify-center items-center">
                            Price: {item.price}
                          </div>
                          <div className="flex justify-center items-center">
                            Author: {item.author}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <div>
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div> */}
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
    </LayoutAdjuster>
  );
}

export default GetBooks;
