import { updateCategory } from "../../redux/categories/categorySlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";

function UpdateCategory() {

    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")
    const name = searchParams.get("name")

    const [categoryName, setCategoryName] = useState(name);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost/PJCIDB/admin/category/updatecategory.php",
                { id, name: categoryName },
                { headers: { "content-type": "multipart/form-data" } }
            );
            dispatch(updateCategory(response.data));
            // fetchCategory();
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
        setCategoryName("");
        // setAddNewCategory((perv) => !perv);
    };

    return (
        <div className="container flex flex-col justify-center items-center">
            <h1 className="text-center text-3xl font-bold">Update Category</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-between items-center border-2 rounded-lg border-gray-900 p-3 w-fit my-10 md:w-auto"
            >
                <input
                    type="text"
                    key="c_name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter Category Name"
                    className="border-2 rounded-lg border-black p-2 text-sm font-bold mb-4 w-full md:w-auto"
                />
                <button
                    type="submit"
                    className="border-2 rounded-lg bg-blue-500 p-2 text-sm font-semibold border-transparent hover:bg-blue-700 text-white transition-all duration-500 w-full md:w-auto"
                >
                    Update Category
                </button>
            </form>
            {/* <button
                onClick={() => setAddNewCategory((perv) => !perv)}
                className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
            >
                Close
            </button> */}
            <LinkButton to={"/category"} use={"close"}>Close</LinkButton>
        </div>
    );
}

export default UpdateCategory;
