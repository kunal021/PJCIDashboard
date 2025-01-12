import Loader from "@/utils/Loader";
import { useEffect, useState } from "react";
import Add from "./Add";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";
import { useHeading } from "@/hooks/use-heading";
import RenderImages from "./RenderImages";
import { deleteImage, setImage } from "@/redux/image/imageSlice";
import { useDispatch, useSelector } from "react-redux";

const fetchData = async (
  dispatch,
  setLoading,
  currentPage,
  setPaginationData,
  tag
) => {
  try {
    setLoading(true);
    console.log(tag);
    const formData = new FormData();
    formData.append("page", currentPage);
    formData.append("limit", 25);
    formData.append("tags", tag || "");
    const response = await axios.post(
      `${API_URL}/admin/images/getimageswithpagination.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    // console.log(response.data);
    dispatch(setImage(response.data.data));
    setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetImage() {
  const { setHeading } = useHeading();
  const dispatch = useDispatch();
  const image = useSelector((state) => state.image.image);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">Images</h1>
        <Add
          fetchData={() =>
            fetchData(dispatch, setLoading, currentPage, setPaginationData)
          }
        />
      </div>
    );
    fetchData(dispatch, setLoading, currentPage, setPaginationData);
  }, [currentPage, dispatch, setHeading]);

  const handleTagChange = () => {
    dispatch(setImage([]));
    setPaginationData({});
    setCurrentPage(1);
    fetchData(dispatch, setLoading, currentPage, setPaginationData, tag);
  };

  const handleDelete = async (id) => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/images/deleteimage.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 200) {
        dispatch(deleteImage(id));
        toast.success("Image Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error while deleting Image");
    }
    // finally {
    //   setLoading(false);
    // }
  };

  // console.log(tag);

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        // <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
        //   <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-5">
        //     <FormField
        //       htmlFor={"tag"}
        //       id={"tag"}
        //       type={"text"}
        //       placeholder={"Search By Tag"}
        //       name={"tag"}
        //       value={tag}
        //       onChange={(e) => setTag(e.target.value)}
        //     />
        //     <button className="mb-2 border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 max-sm:w-full">
        //       Search
        //     </button>
        //   </div>
        //   <div className="w-full flex flex-col justify-center items-center my-4">
        //     <div className="w-full flex flex-col justify-center items-center">
        //       {image.length > 0 ? (
        //         <div className="flex flex-wrap gap-2 justify-center items-center w-full">
        //           {image.map((item, idx) => (
        //             <div
        //               key={idx}
        //               className="flex justify-center items-center font-medium w-48 border rounded-md border-zinc-300 mb-4 p-1 sm:p-2 gap-3"
        //             >
        //               <div className="flex flex-col justify-center items-start gap-2 w-full">
        //                 <div className="flex justify-between items-center w-full gap-4">
        //                   <Avatar className="bg-gray-500 text-white max-sm:scale-90">
        //                     {(currentPage - 1) * 10 + (idx + 1)}
        //                   </Avatar>

        //                   <ConfirmDelete
        //                     handleClick={() => handleDelete(item.id)}
        //                   />
        //                 </div>
        //                 <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
        //                 <div
        //                   onClick={() => window.open(item.url, "_blank")}
        //                   className="cursor-pointer flex justify-between items-center w-full gap-6"
        //                 >
        //                   <div className="flex justify-center items-center w-full">
        //                     <img
        //                       src={item.img_url}
        //                       className="h-48 w-48 rounded-md"
        //                     />
        //                   </div>
        //                 </div>
        //               </div>
        //             </div>
        //           ))}
        //         </div>
        //       ) : (
        //         <div className="text-2xl font-bold text-center mt-20">
        //           No Data Available
        //         </div>
        //       )}
        //       <div>
        //         <Pagination
        //           totalPage={paginationData.total_pages}
        //           currPage={currentPage}
        //           setCurrPage={setCurrentPage}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <RenderImages
          image={image}
          tag={tag}
          setTag={setTag}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleDelete={handleDelete}
          paginationData={paginationData}
          handleTagChange={handleTagChange}
        />
      )}
    </>
  );
}

export default GetImage;
