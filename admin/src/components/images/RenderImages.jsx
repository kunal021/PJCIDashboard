/* eslint-disable react/prop-types */
import { setImageURL } from "@/redux/image/imageURLSlice";
import ConfirmDelete from "@/utils/ConfirmDelete";
import FormField from "@/utils/FormField";
import Pagination from "@/utils/Pagination";
import { Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";

function RenderImages({
  image,
  currentPage,
  setCurrentPage,
  tag,
  setTag,
  handleDelete,
  paginationData,
  handleTagChange,
}) {
  const dispatch = useDispatch();
  const imageURL = useSelector((state) => state.imageURL.imageURL);
  const imageURLClassname = "bg-blue-200";

  const handleSelectImage = (url) => {
    dispatch(setImageURL(url));
  };

  const handleDeleteImage = async (id) => {
    handleDelete(id);
    dispatch(setImageURL(""));
  };

  return (
    <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
      <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-5">
        <FormField
          htmlFor={"tag"}
          id={"tag"}
          type={"text"}
          placeholder={"Search By Tag"}
          name={"tag"}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button
          onClick={handleTagChange}
          className="mb-2 border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 max-sm:w-full"
        >
          Search
        </button>
      </div>
      <div className="w-full flex flex-col justify-center items-center my-4">
        <div className="w-full flex flex-col justify-center items-center">
          {image.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center items-center w-full">
              {image.map((item, idx) => (
                <div
                  key={idx}
                  className={`${
                    imageURL === item.img_url ? imageURLClassname : ""
                  } flex justify-center items-center font-medium w-48 border rounded-md border-zinc-300 mb-4 p-1 sm:p-2 gap-3`}
                >
                  <div className="flex flex-col justify-center items-start gap-2 w-full">
                    <div className="flex justify-between items-center w-full gap-4">
                      <Avatar className="bg-gray-500 text-white max-sm:scale-90">
                        {(currentPage - 1) * 10 + (idx + 1)}
                      </Avatar>

                      <ConfirmDelete
                        handleClick={() => handleDeleteImage(item.id)}
                      />
                    </div>
                    <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                    <div
                      // onClick={() => window.open(item.img_url, "_blank")}
                      onClick={() => handleSelectImage(item.img_url)}
                      className="cursor-pointer flex justify-between items-center w-full gap-6"
                    >
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={item.img_url}
                          className="h-48 w-48 rounded-md"
                        />
                      </div>
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
          <div>
            {image.length > 0 && (
              <Pagination
                totalPage={paginationData.total_pages}
                currPage={currentPage}
                setCurrPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RenderImages;
