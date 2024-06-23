/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../redux/categories/categorySlice";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";

function AddCategory({ fetchCategory, setAddNewCategory }) {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/admin/category/add.php`,
        { c_name: categoryName },
        { headers: { "content-type": "multipart/form-data" } }
      );
      dispatch(addCategory(response.data));
      if (response.status == 201) {
        toast.success("Category Added Sucessfully");
      }
      fetchCategory();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setCategoryName("");
    setAddNewCategory((perv) => !perv);
  };

  const handleContentData = (html) => {
    setCategoryName(html);
  };

  return (
    <div className="w-[70vw] flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl font-bold">Add Category</h1>
      <div className="flex flex-col justify-between items-center border-2 rounded-lg border-gray-900 p-5 gap-5 w-full my-10">
        <div className="w-full my-10">
          <Tiptap placeholder="Category" getHtmlData={handleContentData} />
        </div>
        <button
          onClick={handleSubmit}
          className="border-2 rounded-lg bg-blue-500 p-2 text-sm font-semibold border-transparent hover:bg-blue-700 text-white transition-all duration-500 w-full md:w-auto z-50"
        >
          Add Category
        </button>
      </div>
      <button
        onClick={() => setAddNewCategory((perv) => !perv)}
        className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
      >
        Close
      </button>
    </div>
  );
}

export default AddCategory;
