import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../../redux/users/userSlice";
import axios from "axios";

const getUsers = async (dispatch) => {
    try {
        const response = await axios.post("http://localhost/PJCIDB/admin/user/getallstudentlist.php");
        console.log(response.data.data)
        dispatch(setUser(response.data.data))
    } catch (error) {
        console.log(error)
    }
}

function GetAllUsers() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
        getUsers(dispatch)
    }, [dispatch]);

    const handleChangeStatus = async (userId, isactive) => {
        const confirmAlert = window.confirm(`${isactive === "1"
            ? "User will become Inactive. Do you want to proceed"
            : "User will become Active. Do you want to proceed"}`
        )
        if (confirmAlert) {
            try {
                isactive = isactive === "1" ? "0" : "1";
                const formData = new FormData();
                formData.append("userid", userId);
                formData.append("statuscode", isactive)
                await axios.post("http://localhost/PJCIDB/admin/user/updateuserstatus.php",
                    formData,
                    { headers: { "content-type": "multipart/form-data" } }
                )

                getUsers(dispatch)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return <div className="w-fit flex flex-col justify-center items-center mx-auto">
        <div
            className={` "w-fit flex flex-col justify-center items-center mx-auto"
                } `}
        >
            <div className="flex justify-center items-center space-x-10">
                <h1 className="text-3xl font-bold text-center my-5">Course List</h1>
                {/* <LinkButton to={"/add-user"}>Add Course</LinkButton> */}
            </div>
            <table className="table-auto w-full m-5 border-2">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-sm">Id</th>
                        <th className="p-2 text-sm">First Name</th>
                        <th className="p-2 text-sm">Last Name</th>
                        <th className="p-2 text-sm">Mobile No.</th>
                        <th className="p-2 text-sm">Active</th>
                        <th className="p-2 text-sm">Update</th>
                        <th className="p-2 text-sm">Delete</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {user.map((user) => (
                        <tr key={user.id} className="bg-gray-100">
                            <td className="border p-2 text-sm">{user.id}</td>
                            <td className="border p-2 text-sm">{user.firstname}</td>
                            <td className="border p-2 text-sm">{user.Lastname}</td>
                            <td className="border p-2 text-sm">{user.mo_number}</td>
                            <td className="border p-2 text-sm flex justify-center items-center">
                                {user.isactive === "1"
                                    ? <p onClick={() => handleChangeStatus(user.id, user.isactive)} className="cursor-pointer h-5 w-5 rounded-full bg-green-500"></p>
                                    : <p onClick={() => handleChangeStatus(user.id, user.isactive)} className="cursor-pointer h-5 w-5 rounded-full bg-red-500"></p>
                                }
                            </td>
                            <td className="border p-2 text-sm">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-xs rounded"
                                // onClick={() => {
                                //     setUpdateCourse((prev) => !prev);
                                //     setUpdateCourseData(user);
                                // }}
                                >
                                    Update
                                </button>
                            </td>
                            <td className="border p-2 text-sm">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 text-xs rounded"
                                // onClic k={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* {updateCourse && <UpdateCourse
            fetchCourse={() => fetchCourse(dispatch)}
            setUpdateCourse={setUpdateCourse}
            updateCourseData={updateCourseData}
        />} */}
    </div >;
}

export default GetAllUsers;
