import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../../redux/users/userSlice";
import axios from "axios";
import "../../utils/toggleBtn.css"
import { API_URL } from "../../url";
import UpdateBtn from "../../utils/UpdateBtn";
import ConfirmDelete from "../../utils/ConfirmDelete";

const getUsers = async (dispatch) => {
    try {
        const response = await axios.post(`${API_URL}/admin/user/getallstudentlist.php`);
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
                await axios.post(`${API_URL}/admin/user/updateuserstatus.php`,
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
                        <th className="p-2 text-sm">Name</th>
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
                            <td className="border p-2 text-sm">{user.firstname}{" "}{user.Lastname}</td>
                            <td className="border p-2 text-sm">{user.mo_number}</td>
                            <td className="border p-2 text-sm flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        handleChangeStatus(user.id, user.isactive);
                                    }}
                                    className="toggle-switch scale-75"
                                >
                                    <input type="checkbox" checked={user.isactive === "1"} readOnly />
                                    <div className="toggle-switch-background">
                                        <div className="toggle-switch-handle"></div>
                                    </div>
                                </button>
                            </td>
                            <td className="border p-2 text-sm">
                                <UpdateBtn handleClick={() => {
                                    // setUpdateTest((prev) => !prev);
                                    // setUpdateTestData(test);
                                }} />
                            </td>
                            <td className="border p-2 text-sm">
                                <ConfirmDelete
                                // handleClick={() => handleDelete(test.test_id)} 
                                />
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
