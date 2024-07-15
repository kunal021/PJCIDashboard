/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../redux/categories/categorySlice";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
// import Tiptap from "../../utils/TextEditor";
import FormField from "../../utils/FormField";

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

  // const handleContentData = (html) => {
  //   setCategoryName(html);
  // };

  return (
    <div className="w-[70vw] flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl font-bold">Add Category</h1>
      <div className="flex flex-col justify-between items-center border rounded-xl border-gray-400 w-full my-10 p-5">
        {/* <div className="w-full my-2">
          <Tiptap placeholder="Category" getHtmlData={handleContentData} />
        </div> */}
        <FormField
          name="category"
          value={categoryName}
          htmlFor={"category"}
          onChange={(e) => setCategoryName(e.target.value)}
          id={"category"}
          type={"text"}
        >
          Category Name
        </FormField>
        <button
          onClick={handleSubmit}
          className="rounded-md bg-blue-50 p-2 text-sm font-semibold hover:bg-blue-100 border-blue-200 text-black border w-full md:w-auto z-50"
        >
          Add Category
        </button>
      </div>
      <button
        onClick={() => setAddNewCategory((perv) => !perv)}
        className="border rounded-md bg-red-50 py-2 px-4 text-sm font-semibold hover:bg-red-100 border-red-200 text-black w-full md:w-auto"
      >
        Close
      </button>
    </div>
  );
}

export default AddCategory;
