import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCategory } from "../../redux/categories/categorySlice";
import axios from "axios";

function DeleteCategory() {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost/PJCIDB/category/delcategory.php?c_name=${categoryName}`
      );
      dispatch(deleteCategory(response.data));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setCategoryName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          key="c_name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter Category Name"
        />
        <button type="submit">Delete Category</button>
      </form>
    </div>
  );
}

export default DeleteCategory;
