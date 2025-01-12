/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../redux/categories/categorySlice";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function AddCategory({ fetchCategory }) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (categoryName.length > 255) {
      toast.error("Category name should be less than 255 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/admin/category/add.php`,
        { c_name: categoryName },
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 201) {
        toast.success("Category Added Sucessfully");
        dispatch(addCategory());
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
        className="cursor-pointer border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="h-5 w-5" /> : "Add Category"}
        </div>
      </DialogTrigger>
      <DialogContent>
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

export default AddCategory;
