/* eslint-disable react/prop-types */
import { setImageURL } from "@/redux/image/imageURLSlice";
import ConfirmDelete from "@/utils/ConfirmDelete";
import FormField from "@/utils/FormField";
import Pagination from "@/utils/Pagination";
import { useDispatch } from "react-redux";

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

  const handleSelectImage = (url) => {
    dispatch(setImageURL(url));
  };

  const handleDeleteImage = async (id) => {
    handleDelete(id);
    dispatch(setImageURL(""));
  };

  return (
    <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
      {/* Search Box */}
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

      {/* Image Gallery */}
      <div className="w-full my-4 flex flex-col justify-center items-center gap-2">
        {image.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 border border-gray-400">
            {image.map((item, idx) => (
              <div key={idx} className="group relative border border-gray-400">
                {/* Confirm Delete - Appears on Hover */}
                <div className="absolute top-2 right-2 hidden group-hover:flex">
                  <ConfirmDelete
                    handleClick={() => handleDeleteImage(item.id)}
                  />
                </div>

                {/* Image Preview */}
                <img
                  src={item.img_url}
                  onClick={() => handleSelectImage(item.img_url)}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-2xl font-bold text-center mt-20">
            No Data Available
          </div>
        )}

        {/* Pagination */}
        {image.length > 0 && (
          <Pagination
            totalPage={paginationData.total_pages}
            currPage={currentPage}
            setCurrPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default RenderImages;
