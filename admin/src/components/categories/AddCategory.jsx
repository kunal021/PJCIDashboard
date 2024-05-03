/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../redux/categories/categorySlice";
import axios from "axios";

function AddCategory({ fetchCategory }) {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/PJCIDB/admin/category/add.php",
        { c_name: categoryName }
      );
      console.log("Response:", response.data);
      dispatch(addCategory(response.data));
      fetchCategory();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setCategoryName("");
  };

  return (
    <div className="container mx-auto w-[20vw]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between items-center border-2 rounded-lg border-gray-500 border-dashed p-3 w-full md:w-auto"
      >
        <input
          type="text"
          key="c_name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter Category Name"
          className="border-2 rounded-lg border-black p-2 text-lg font-bold mb-4 w-full md:w-auto"
        />
        <button
          type="submit"
          className="border-2 rounded-lg border-blue-500 p-2 text-lg font-semibold text-blue-500 hover:border-transparent hover:bg-blue-500 hover:text-white transition-all duration-500 w-full md:w-auto"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
