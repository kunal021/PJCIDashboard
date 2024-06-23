import { updateCategory } from "../../redux/categories/categorySlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Tiptap from "../../utils/TextEditor";

function UpdateCategory() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [categoryName, setCategoryName] = useState(name);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/admin/category/updatecategory.php`,
        { id, name: categoryName },
        { headers: { "content-type": "multipart/form-data" } }
      );
      dispatch(updateCategory(response.data));
      // fetchCategory();
      if (response.status == 200) {
        toast.success("Category Updated Successfully");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setCategoryName("");
  };

  const handleContentData = (html) => {
    setCategoryName(html);
  };

  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-center text-3xl font-bold">Update Category</h1>
        <div className="flex flex-col justify-between items-center border-2 rounded-lg border-gray-900 p-3 w-full my-10">
          <div className="w-full my-10">
            <Tiptap placeholder="Category" getHtmlData={handleContentData} />
          </div>
          <button
            onClick={handleSubmit}
            className="border-2 rounded-lg bg-blue-500 p-2 text-sm font-semibold border-transparent hover:bg-blue-700 text-white transition-all duration-500 w-full md:w-auto"
          >
            Update Category
          </button>
        </div>
        {/* <button
                onClick={() => setAddNewCategory((perv) => !perv)}
                className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
            >
                Close
            </button> */}
        <LinkButton to={"/category"} use={"close"}>
          Close
        </LinkButton>
      </div>
    </LayoutAdjuster>
  );
}

export default UpdateCategory;
