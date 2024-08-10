import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategory,
  deleteCategory,
} from "../../redux/categories/categorySlice";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import UpdateBtn from "../../utils/UpdateBtn";
import ConfirmDelete from "../../utils/ConfirmDelete";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import { Avatar } from "antd";
import AddCourseInCategory from "./AddCourseInCategory";
// import SeeAll from "../../utils/SeeAll";
import { API_URL } from "../../url";
import AddCategory from "./AddCategory";

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

  const handleDelete = useCallback(
    async (categoryId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/category/delcategory.php?id=${categoryId}`
        );

        if (response.status === 200) {
          dispatch(deleteCategory(categoryId));
          toast.success("Category Deleted Successfully");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting category");
      }
    },
    [dispatch]
  );

  const handleChangeStatus = useCallback(
    async (categoryId, isactive) => {
      const confirmAlert = window.confirm(
        `${
          isactive === "1"
            ? "Category will become Inactive. Do you want to proceed?"
            : "Category will become Active. Do you want to proceed?"
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

          const updatedCategory = category.map((cat) =>
            cat.id === categoryId ? { ...cat, isactive } : cat
          );
          dispatch(setCategory(updatedCategory));
        } catch (error) {
          console.log("Error updating category status:", error);
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
              : "w-[80%] flex flex-col justify-center items-center mx-auto"
          }`}
        >
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">Category List</h1>
            <button
              onClick={() => setAddNewCategory((prev) => !prev)}
              className="border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200"
            >
              Add Category
            </button>
          </div>
          {category.length > 0 ? (
            <div className="flex flex-col justify-center items-center w-full">
              {category.map(
                (cat, idx) =>
                  cat && (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-2 gap-4"
                    >
                      <div className="flex flex-col justify-center items-start gap-2 w-full">
                        <div className="flex justify-between items-center w-full gap-4">
                          <Avatar className="bg-gray-500 text-white">
                            {cat.id}
                          </Avatar>
                          <AddCourseInCategory categoryId={cat.id} />
                          <Link
                            to={`/update-category?id=${cat.id}&name=${cat.name}`}
                          >
                            <UpdateBtn />
                          </Link>
                          <ConfirmDelete
                            handleClick={() => handleDelete(cat.id)}
                          />
                          <button
                            onClick={() => {
                              handleChangeStatus(cat.id, cat.isactive);
                            }}
                            className="toggle-switch scale-75 align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={cat.isactive === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className="flex justify-center items-center gap-6 w-full">
                          <Link
                            to={`/get-course-category-wise?id=${cat.id}`}
                            className="flex flex-col justify-center items-start gap-3 w-full cursor-pointer"
                          >
                            <div className="text-start w-full">{cat.name}</div>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit"></div>
                    </div>
                  )
              )}
            </div>
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
