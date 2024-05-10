/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTest } from "../../redux/tests/testSlice";
import axios from "axios";

function UpdateTest({ fetchTest, updateTestData, setUpdateTest }) {
    // const [categoryName, setCategoryName] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {

    })

    console.log(updateTestData)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost/PJCIDB/admin/category/add.php",
                // { c_name: categoryName },
                { headers: { "content-type": "multipart/form-data" } }
            );
            dispatch(updateTest(response.data));
            fetchTest();
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
        // setCategoryName("");
        setUpdateTest((perv) => !perv);
    };

    return (
        <div className="w-fit flex flex-col justify-center items-center">
            <h1 className="text-center text-3xl font-bold">Update Test</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-between items-center border-2 rounded-lg border-gray-900 p-3 w-fit my-10 md:w-auto"
            >
                <input
                    type="text"
                    key="c_name"
                    // value={categoryName}
                    // onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter Category Name"
                    className="border-2 rounded-lg border-black p-2 text-sm font-bold mb-4 w-full md:w-auto"
                />
                <button
                    type="submit"
                    className="border-2 rounded-lg bg-blue-500 p-2 text-sm font-semibold border-transparent hover:bg-blue-700 text-white transition-all duration-500 w-full md:w-auto"
                >
                    Add Category
                </button>
            </form>
            <button
                // onClick={() => setAddNewCategory((perv) => !perv)}
                className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
            >
                Close
            </button>
        </div>
    );
}

export default UpdateTest;
