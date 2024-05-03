import { useEffect } from "react";
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
    console.error("Error fetching courses:", error);
  }
};

function GetCategory() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.category.category);

  useEffect(() => {
    fetchCategory(dispatch);
  }, [dispatch]);

  const handleDelete = async (courseName, courseId) => {
    try {
      const response = await axios.delete(
        `http://localhost/PJCIDB/admin/category/delcategory.php?id=${courseId}`
      );
      console.log("Response:", response.data);
      console.log(courseName);
      if (courseId && response.data.success) {
        dispatch(deleteCategory(response.data));
      }
      fetchCategory(dispatch);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  return (
    <div className="container w-[80%]">
      <h1 className="text-center text-3xl font-bold my-10">Category List</h1>
      <table className="table-auto w-[70vw] m-10 border-2">
        <thead>
          <tr>
            <th className="px-2 py-2">Id</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Update</th>
            <th className="px-2 py-2">Delete</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {courses.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-2">{item.id}</td>
              <td className="border px-2 py-2">{item.name}</td>
              <td className="border px-2 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleUpdate(item.name, item.id)}
                >
                  Update
                </button>
              </td>
              <td className="border px-2 py-2">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(item.name, item.id)}
                >
                  Delete
                </button>
              </td>
              <td className="border px-2 py-2">
                <Link to={`/get-course-category-wise?id=${item.id}`}>
                  See all Course
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddCategory fetchCategory={() => fetchCategory(dispatch)} />
    </div>
  );
}

export default GetCategory;
