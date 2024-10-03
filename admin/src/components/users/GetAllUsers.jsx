import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { setUser } from "../../redux/users/userSlice";
import axios from "axios";
import "../../utils/toggleBtn.css";
import { API_URL } from "../../url";
import UpdateBtn from "../../utils/UpdateBtn";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Pagination from "../../utils/Pagination";
import UpdateUser from "./UpdateUser";
import Loader from "../../utils/Loader";
import More from "./More";
import SearchUser from "./SearchUser";

const getUsers = async (dispatch, setPaginationData, page, setLoading) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("page", page);
    formData.append("limit", 10);
    const response = await axios.post(
      `${API_URL}/admin/user/getallstudentlist.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    dispatch(setUser(response.data.data));
    setPaginationData(response.data.pagination);
  } catch (error) {
    console.log("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};

function GetAllUsers() {
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUserData, setUpdateUserData] = useState({});
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.user);

  useEffect(() => {
    getUsers(dispatch, setPaginationData, currentPage, setLoading);
  }, [currentPage, dispatch]);

  const handleChangeStatus = useCallback(
    async (userId, isactive) => {
      const confirmAlert = window.confirm(
        `${
          isactive === "1"
            ? "User will become Inactive. Do you want to proceed"
            : "User will become Active. Do you want to proceed"
        }`
      );
      if (confirmAlert) {
        try {
          isactive = isactive === "1" ? "0" : "1";
          const formData = new FormData();
          formData.append("userid", userId);
          formData.append("statuscode", isactive);
          await axios.post(
            `${API_URL}/admin/user/updateuserstatus.php`,
            formData,
            { headers: { "content-type": "multipart/form-data" } }
          );

          // Update local state instead of fetching users again
          const updatedUsers = users.map((user) =>
            user.id === userId ? { ...user, isactive } : user
          );
          dispatch(setUser(updatedUsers));
        } catch (error) {
          console.log("Error updating user status:", error);
          // Handle error (e.g., show an error message)
        }
      }
    },
    [dispatch, users]
  );

  // console.log(users);

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            updateUser
              ? "hidden"
              : "w-[80%] flex flex-col justify-center items-center mx-auto"
          }`}
        >
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-3xl font-bold text-center my-5">All Users</h1>
            {/* <LinkButton to={"/add-user"}>Add Course</LinkButton> */}
          </div>
          <SearchUser />
          {users.length > 0 ? (
            <>
              <table className="table-auto w-full m-5 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-sm">Id</th>
                    <th className="p-2 text-sm">Name</th>
                    <th className="p-2 text-sm">Mobile No.</th>
                    <th className="p-2 text-sm">Email</th>
                    <th className="p-2 text-sm">Status</th>
                    <th className="p-2 text-sm">Update</th>
                    {/* <th className="p-2 text-sm">Delete</th> */}
                    <th className="p-2 text-sm">More</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {users.map((user, idx) => (
                    <tr key={user.id} className="bg-gray-50">
                      <td className="border p-2 text-sm">
                        {(currentPage - 1) * 10 + (idx + 1)}
                      </td>
                      <td className="border p-2 text-sm">
                        {user.firstname} {user.lastname}
                      </td>
                      <td className="border p-2 text-sm">{user.mo_number}</td>
                      <td className="border p-2 text-sm">{user.email}</td>
                      <td className="border p-1 text-sm flex flex-col justify-center items-center">
                        <p className="text-xs font-bold">
                          {user.isactive === "1" ? "Public" : "Private"}
                        </p>
                        <button
                          onClick={() => {
                            handleChangeStatus(user.id, user.isactive);
                          }}
                          className="toggle-switch scale-75"
                        >
                          <input
                            type="checkbox"
                            checked={user.isactive === "1"}
                            readOnly
                          />
                          <div className="toggle-switch-background">
                            <div className="toggle-switch-handle"></div>
                          </div>
                        </button>
                      </td>
                      <td className="border p-2 text-sm">
                        <UpdateBtn
                          handleClick={() => {
                            setUpdateUserData(user);
                            setUpdateUser(true);
                          }}
                        />
                      </td>
                      {/* <td className="border p-2 text-sm">
                        <ConfirmDelete
                          handleClick={() => {
                            // Handle delete button click
                          }}
                        />
                      </td> */}
                      <td className="border p-2 text-sm ">
                        <More user={user} />
                        {/* <div className="flex justify-center items-center">
                          <Ellipsis className="cursor-pointer" />
                        </div> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-4">
                <Pagination
                  totalPage={paginationData.total_pages}
                  currPage={currentPage}
                  setCurrPage={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
      {updateUser && (
        <UpdateUser
          setUpdateUser={setUpdateUser}
          updateUserData={updateUserData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetAllUsers;
