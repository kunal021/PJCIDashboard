import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategory,
  deleteCategory,
} from "../../redux/categories/categorySlice";
import axios from "axios";
import { Link } from "react-router-dom";
import AddCategory from "./AddCategory";
import LinkButton from "../../utils/LinkButton";

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
    const deleteAlert = window.confirm("Do you want to delete this category?")
    if (deleteAlert) {
      try {
        const response = await axios.delete(
          `http://localhost/PJCIDB/admin/category/delcategory.php?id=${courseId}`
        );
        if (courseId && response.data.success) {
          dispatch(deleteCategory(response.data));
        }
        fetchCategory(dispatch);
      } catch (error) {
        alert(error.response.data.massage)
        // console.error("Error fetching category:", error);
      }
    }
  };

  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      <div
        className={`${addNewCategory
          ? "hidden"
          : "w-fit flex flex-col justify-center items-center mx-auto"
          } `}
      >
        <div className="flex justify-center items-center space-x-10">
          <h1 className="text-center text-3xl font-bold my-5">Category List</h1>
          <button
            onClick={() => setAddNewCategory((prev) => !prev)}
            className="border-2 rounded-lg border-transparent bg-blue-500 p-2 text-sm font-semibold text-white hover:bg-blue-700 hover:text-white transition-all duration-500 w-full md:w-auto"
          >
            Add Category
          </button>
        </div>
        <table className="table-auto w-full m-5 border-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-sm">Id</th>
              <th className="p-2 text-sm">Name</th>
              <th className="p-2 text-sm">Update</th>
              <th className="p-2 text-sm">Delete</th>
              <th className="p-2 text-sm">See All Course</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {category.map((item) => (
              <tr key={item.id} className="bg-gray-100">
                {/* {console.log(item.id)} */}
                <td className="border p-2 text-sm">{item.id}</td>
                <td className="border p-2 text-sm">{item.name}</td>
                <td className="border p-2 text-sm">
                  {/* <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    // onClick={() => handleUpdate(item.name, item.id)}
                  >
                    Update
                  </button> */}
                  <LinkButton to={`/update-category?id=${item.id}&name=${item.name}`} use={"update"}>Update</LinkButton>
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
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold p-1 text-xs rounded">
                      See All Course
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
