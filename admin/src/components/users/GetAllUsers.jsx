import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { setUser } from "../../redux/users/userSlice";
import axios from "axios";
import "../../utils/toggleBtn.css";
import { API_URL } from "../../url";
import UpdateBtn from "../../utils/UpdateBtn";
import ConfirmDelete from "../../utils/ConfirmDelete";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Pagination from "../../utils/Pagination";

const getUsers = async (dispatch, setPaginationData, page) => {
  try {
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
    // Handle error (e.g., show an error message)
  }
};

function GetAllUsers() {
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.user);

  useEffect(() => {
    getUsers(dispatch, setPaginationData, currentPage);
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

  return (
    <LayoutAdjuster>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center space-x-10">
          <h1 className="text-3xl font-bold text-center my-5">All Users</h1>
          {/* <LinkButton to={"/add-user"}>Add Course</LinkButton> */}
        </div>
        {users.length > 0 ? (
          <>
            <table className="table-auto w-full m-5 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-sm">Id</th>
                  <th className="p-2 text-sm">Name</th>
                  <th className="p-2 text-sm">Mobile No.</th>
                  <th className="p-2 text-sm">Active</th>
                  <th className="p-2 text-sm">Update</th>
                  <th className="p-2 text-sm">Delete</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {users.map((user) => (
                  <tr key={user.id} className="bg-gray-50">
                    <td className="border p-2 text-sm">{user.id}</td>
                    <td className="border p-2 text-sm">
                      {user.firstname} {user.Lastname}
                    </td>
                    <td className="border p-2 text-sm">{user.mo_number}</td>
                    <td className="border p-2 text-sm flex justify-center items-center">
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
                          // Handle update button click
                        }}
                      />
                    </td>
                    <td className="border p-2 text-sm">
                      <ConfirmDelete
                        handleClick={() => {
                          // Handle delete button click
                        }}
                      />
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
    </LayoutAdjuster>
  );
}

export default GetAllUsers;
