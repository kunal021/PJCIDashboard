import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { setUser } from "../../redux/users/userSlice";
import axios from "axios";
import "../../utils/toggleBtn.css";
import { API_URL } from "../../url";
import Pagination from "../../utils/Pagination";
import UpdateUser from "./UpdateUser";
import Loader from "../../utils/Loader";
import More from "./More";
import SearchUser from "./SearchUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useHeading } from "@/hooks/use-heading";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.user);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">All Users</h1>
      </div>
    );
    getUsers(dispatch, setPaginationData, currentPage, setLoading);
  }, [currentPage, dispatch, setHeading]);

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

          const updatedUsers = users.map((user) =>
            user.id === userId ? { ...user, isactive } : user
          );
          dispatch(setUser(updatedUsers));
        } catch (error) {
          console.log("Error updating user status:", error);
        }
      }
    },
    [dispatch, users]
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="my-5 w-full">
            <SearchUser />
          </div>
          {users.length > 0 ? (
            <>
              <div className="w-full relative">
                <div className="w-full absolute">
                  <Table className="border border-gray-200 rounded">
                    <TableHeader>
                      <TableRow className="divide-x divide-gray-200">
                        <TableHead className="w-[50px]  text-center">
                          Id
                        </TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">
                          Mobile No.
                        </TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">
                          Resgister Date
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Update</TableHead>
                        <TableHead className="text-center">More</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                      {users.map((user, idx) => (
                        <TableRow
                          key={user.id}
                          className="divide-x divide-gray-200 text-center"
                        >
                          <TableCell>
                            {(currentPage - 1) * 10 + (idx + 1)}
                          </TableCell>
                          <TableCell>
                            <div
                              onClick={() =>
                                navigate(`/users/${user.mo_number}`, {
                                  state: { data: user },
                                })
                              }
                              className="cursor-pointer"
                            >
                              {user.firstname} {user.lastname}
                            </div>
                          </TableCell>
                          <TableCell>{user.mo_number}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.registration_date.slice(0, 10)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-xs font-medium">
                                {user.isactive === "1" ? "Public" : "Private"}
                              </span>

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
                            </div>
                          </TableCell>
                          <TableCell>
                            <UpdateUser updateUserData={user} />
                          </TableCell>
                          <TableCell>
                            <More user={user} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="my-4 w-full flex justify-center items-center ">
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div>
                </div>
              </div>
            </>
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

export default GetAllUsers;
