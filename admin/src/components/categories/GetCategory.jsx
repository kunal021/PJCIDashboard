import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategory,
  deleteCategory,
} from "../../redux/categories/categorySlice";
import axios from "axios";
import { Link } from "react-router-dom";
import AddCategory from "./AddCategory";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateBtn from "../../utils/UpdateBtn";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import SeeAll from "../../utils/SeeAll";
import AddCourseInCategory from "./AddCourseInCategory";
// import parser from "html-react-parser";

const fetchCategory = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/admin/category/get.php`);
    dispatch(setCategory(response.data.data));
  } catch (error) {
    console.error("Error fetching category:", error);
  } finally {
    setLoading(false);
  }
};

function GetCategory() {
  const [loading, setLoading] = useState(false);
  const [addNewCategory, setAddNewCategory] = useState(false);

  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.category);

  useEffect(() => {
    fetchCategory(dispatch, setLoading);
  }, [dispatch]);

  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/category/delcategory.php?id=${categoryId}`
      );
      // console.log(response);
      if (categoryId && response.data.success) {
        dispatch(deleteCategory(categoryId));
      }
      if (response.status == 200) {
        dispatch(deleteCategory(response.data));
        toast.success("Category Deleted Successfully");
      }
      fetchCategory(dispatch, setLoading);
    } catch (error) {
      toast.error(error.response.data.massage);
    }
  };

  const handleChangeStatus = useCallback(
    async (categoryId, isactive) => {
      const confirmAlert = window.confirm(
        `${
          isactive === "1"
            ? "Category will become Inactive. Do you want to proceed"
            : "Category will become Active. Do you want to proceed"
        }`
      );
      if (confirmAlert) {
        try {
          isactive = isactive === "1" ? "0" : "1";
          const formData = new FormData();
          formData.append("c_id", categoryId);
          formData.append("statuscode", isactive);
          await axios.post(
            `${API_URL}/admin/category/updatecategorystatus.php`,
            formData,
            { headers: { "content-type": "multipart/form-data" } }
          );

          // Update local state instead of fetching users again
          const updatedCategory = category.map((category) =>
            category.id === categoryId ? { ...category, isactive } : category
          );
          dispatch(setCategory(updatedCategory));
        } catch (error) {
          console.log("Error updating user status:", error);
          // Handle error (e.g., show an error message)
        }
      }
    },
    [dispatch, category]
  );

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            addNewCategory
              ? "hidden"
              : "w-fit flex flex-col justify-center items-center mx-auto"
          } `}
        >
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-center text-3xl font-bold my-5">
              Category List
            </h1>
            <button
              onClick={() => setAddNewCategory((prev) => !prev)}
              className="border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
            >
              Add Category
            </button>
          </div>
          {category.length > 0 ? (
            <table className="table-auto w-full m-5 border-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-sm">Id</th>
                  <th className="p-2 text-sm">Name</th>
                  <th className="p-2 text-sm">Update</th>
                  <th className="p-2 text-sm">Delete</th>
                  <th className="p-2 text-sm">Status</th>
                  <th className="p-2 text-sm">Add Course</th>
                  <th className="p-2 text-sm">All Course</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {category.map((item, idx) => (
                  <tr key={item.id} className="bg-gray-100">
                    <td className="border p-2 text-sm">{idx + 1}</td>
                    <td className="border p-2 text-sm">{item.name}</td>
                    <td className="border p-2 text-sm">
                      <Link
                        to={`/update-category?id=${item.id}&name=${item.name}`}
                      >
                        <UpdateBtn />
                      </Link>
                    </td>
                    <td className="border p-2 text-sm">
                      <ConfirmDelete
                        handleClick={() => handleDelete(item.id)}
                      />
                    </td>
                    <td className="border p-2 text-sm flex justify-center items-center">
                      <button
                        onClick={() => {
                          handleChangeStatus(item.id, item.isactive);
                        }}
                        className="toggle-switch scale-75"
                      >
                        <input
                          type="checkbox"
                          checked={item.isactive === "1"}
                          readOnly
                        />
                        <div className="toggle-switch-background">
                          <div className="toggle-switch-handle"></div>
                        </div>
                      </button>
                    </td>
                    <td className="border p-2 text-sm">
                      <AddCourseInCategory categoryId={item.id} />
                    </td>
                    <td className="border p-2 text-sm">
                      <Link to={`/get-course-category-wise?id=${item.id}`}>
                        <SeeAll childern={"Courses"} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
      {addNewCategory && (
        <AddCategory
          fetchCategory={() => fetchCategory(dispatch, setLoading)}
          setAddNewCategory={setAddNewCategory}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetCategory;
