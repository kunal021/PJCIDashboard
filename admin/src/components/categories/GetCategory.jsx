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
import SeeAll from "../../utils/SeeAll";
import AddCourseInCategory from "./AddCourseInCategory";
import { useHeading } from "@/hooks/use-heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import UpdateCategory from "./UpdateCategory";

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
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.category);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-center text-xl md:text-3xl font-bold">Category</h1>
        <AddCategory
          fetchCategory={() => fetchCategory(dispatch, setLoading)}
        />
      </div>
    );
    fetchCategory(dispatch, setLoading);
  }, [dispatch, setHeading]);

  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/category/delcategory.php?id=${categoryId}`
      );
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

          const updatedCategory = category.map((category) =>
            category.id === categoryId ? { ...category, isactive } : category
          );
          dispatch(setCategory(updatedCategory));
        } catch (error) {
          console.log("Error updating user status:", error);
        }
      }
    },
    [dispatch, category]
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[90%] mx-auto flex justify-center items-center my-5">
          {category.length > 0 ? (
            <div className="w-full relative">
              <div className="w-full absolute">
                <Table className="border border-gray-200 rounded text-sm md:text-base">
                  <TableHeader>
                    <TableRow className="divide-x divide-gray-200">
                      <TableHead className="w-[40px] md:w-[50px] text-center text-xs md:text-sm">
                        Id
                      </TableHead>
                      <TableHead className="text-center text-xs md:text-sm">
                        Name
                      </TableHead>
                      <TableHead className="text-center text-xs md:text-sm">
                        Update
                      </TableHead>
                      <TableHead className="text-center text-xs md:text-sm">
                        Delete
                      </TableHead>
                      <TableHead className="text-center text-xs md:text-sm">
                        Status
                      </TableHead>
                      <TableHead className="text-center text-xs md:text-sm">
                        Add Course
                      </TableHead>
                      <TableHead className="text-center text-xs md:text-sm">
                        All Course
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {category.map((item, idx) => (
                      <TableRow
                        key={item.id}
                        className="divide-x divide-gray-200 text-center"
                      >
                        <TableCell className="text-xs md:text-sm p-2 md:p-4">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm p-2 md:p-4">
                          {item.name}
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <UpdateCategory id={item.id} name={item.name} />
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <ConfirmDelete
                            handleClick={() => handleDelete(item.id)}
                          />
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] md:text-xs font-medium">
                              {item.isactive === "1" ? "Public" : "Private"}
                            </span>
                            <button
                              onClick={() =>
                                handleChangeStatus(item.id, item.isactive)
                              }
                              className="toggle-switch scale-[0.65] md:scale-75"
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
                          </div>
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <AddCourseInCategory categoryId={item.id} />
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <Link
                            to={`/course/get-category-wise?id=${item.id}`}
                            className="text-blue-500 hover:underline text-xs md:text-sm"
                          >
                            <SeeAll childern={"Courses"} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GetCategory;
