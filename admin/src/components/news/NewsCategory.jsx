/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import Loader from "@/utils/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, X } from "lucide-react";
import FormField from "@/utils/FormField";

const fetchCategory = async (setLoading, setCategories) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/news/getallnewscategory.php`
    );

    if (response.status === 200) {
      setCategories(response.data.data);
    }
  } catch (error) {
    console.log(error);
    toast.error(
      error?.response?.data?.message || "Error while fetching Category"
    );
  } finally {
    setLoading(false);
  }
};

function AddCategory({ fetchCategory }) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (categoryName.length > 255) {
      toast.error("Category name should be less than 255 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/admin/news/addnewscategory.php`,
        { category_name: categoryName },
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 201) {
        toast.success("Category Added Sucessfully");
        fetchCategory();
        setOpen(false);
        setCategoryName("");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="cursor-pointer border rounded-md bg-blue-50 p-1 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="z-[200]">
        <DialogHeader className="text-2xl font-bold">Add Category</DialogHeader>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-between items-center w-full">
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
            {categoryName.length > 255 && (
              <p className="text-red-500">
                Category name should be less than 255 characters
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-4 mt-5">
          <button
            disabled={loading}
            onClick={() => !loading && setOpen(false)}
            className="border rounded-md bg-red-50 py-2 px-4 text-sm font-semibold hover:bg-red-100 border-red-200 text-black w-full disabled:opacity-50"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-blue-50 p-2 text-sm font-semibold hover:bg-blue-100 border-blue-200 text-black border w-full"
          >
            Add Category
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GetCategory() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategory(setLoading, setCategories);
  }, []);

  const handleDelete = async (id) => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("category_id", id);
      const response = await axios.post(
        `${API_URL}/admin/news/deletenewscategory.php`,
        formData,
        { headers: "content-type/form-data" }
      );

      if (response.status === 200) {
        const newCat = categories.filter((category) => category.id != id);
        setCategories(newCat);
        toast.success("Category Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Error while deleting Category"
      );
    }
    // finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center border rounded-lg">
      <div className="w-full flex justify-center items-center gap-6 mt-1">
        <h1 className="text-sm font-bold text-center">News Category</h1>
        <AddCategory
          fetchCategory={() => fetchCategory(setLoading, setCategories)}
        />
      </div>

      <div className="w-full max-h-20 flex justify-center items-center overflow-y-auto">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
            <div className="w-full flex flex-col justify-center items-center">
              {categories && categories.length > 0 ? (
                <div className="w-full flex flex-wrap justify-start items-start gap-2 mt-5 mb-2">
                  {categories.map((item, idx) => (
                    <div
                      key={item.id + idx}
                      className="w-fit relative flex justify-center items-center bg-gray-200 px-2 py-1 gap-1 rounded"
                    >
                      <p className="text-xs font-bold text-center">
                        {item.name}
                      </p>

                      <button
                        disabled={loading}
                        onClick={() => handleDelete(item.id)}
                      >
                        <X className="h-3.5 w-3.5 cursor-pointer text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full font-bold text-center">
                  No Categories Found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetCategory;
