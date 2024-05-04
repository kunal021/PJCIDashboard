import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategory,
  deleteCategory,
} from "../../redux/categories/categorySlice";
import axios from "axios";
import { Link } from "react-router-dom";
import AddCategory from "./AddCategory";

const fetchCategory = async (dispatch) => {
  try {
    const response = await axios.get(
      "http://localhost/PJCIDB/admin/category/get.php"
    );

    dispatch(setCategory(response.data.data));
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

function GetCategory() {
  const [addNewCategory, setAddNewCategory] = useState(false);

  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.category);

  useEffect(() => {
    fetchCategory(dispatch);
  }, [dispatch]);

  const handleDelete = async (courseId) => {
    console.log("del");
    try {
      const response = await axios.delete(
        `http://localhost/PJCIDB/admin/category/delcategory.php?id=${courseId}`
      );
      if (courseId && response.data.success) {
        dispatch(deleteCategory(response.data));
      }
      fetchCategory(dispatch);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  return (
    <div className="container w-[85%] flex flex-col justify-center items-center mx-5">
      <div
        className={`${
          addNewCategory
            ? "hidden"
            : "container w-[85%] flex flex-col justify-center items-center mx-5"
        } `}
      >
        <h1 className="text-center text-3xl font-bold my-5">Category List</h1>
        <table className="table-auto w-full m-5 border-2">
          <thead>
            <tr>
              <th className="p-2 text-sm">Id</th>
              <th className="p-2 text-sm">Name</th>
              <th className="p-2 text-sm">Update</th>
              <th className="p-2 text-sm">Delete</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {category.map((item) => (
              <tr key={item.id}>
                {console.log(item.id)}
                <td className="border p-2 text-sm">{item.id}</td>
                <td className="border p-2 text-sm">{item.name}</td>
                <td className="border p-2 text-sm">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    // onClick={() => handleUpdate(item.name, item.id)}
                  >
                    Update
                  </button>
                </td>
                <td className="border p-2 text-sm">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
                <td className="border p-2 text-sm">
                  <Link to={`/get-course-category-wise?id=${item.id}`}>
                    See all Course
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setAddNewCategory((prev) => !prev)}
          className="border-2 rounded-lg border-blue-500 p-2 text-sm font-semibold text-blue-500 hover:border-transparent hover:bg-blue-500 hover:text-white transition-all duration-500 w-full md:w-auto"
        >
          Add Category
        </button>
      </div>
      {addNewCategory && (
        <AddCategory
          fetchCategory={() => fetchCategory(dispatch)}
          setAddNewCategory={setAddNewCategory}
        />
      )}
    </div>
  );
}

export default GetCategory;
