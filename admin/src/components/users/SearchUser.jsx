import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import Loader from "../../utils/Loader";
import UpdateBtn from "../../utils/UpdateBtn";
import More from "./More";
import { setUser } from "../../redux/users/userSlice";
import UpdateUser from "./UpdateUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router-dom";

function SearchUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addCloseRef = useRef();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUserData, setUpdateUserData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    firstname: "",
    lastname: "",
    mo_number: "",
    email: "",
  });

  const users = useSelector((state) => state.user.user);

  const handleChnage = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const getUsers = async () => {
    setUpdateUser(false);
    if (
      !searchQuery.firstname?.trim() &&
      !searchQuery.lastname?.trim() &&
      !searchQuery.mo_number?.trim() &&
      !searchQuery.email?.trim()
    ) {
      toast.error("Please enter at least one field to search");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("firstname", searchQuery.firstname);
      formData.append("lastname", searchQuery.lastname);
      formData.append("mo_number", searchQuery.mo_number);
      formData.append("email", searchQuery.email);
      const response = await axios.post(
        `${API_URL}/admin/user/searchuser.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      setData(response.data.data);
      searchQuery({
        firstname: "",
        lastname: "",
        mo_number: "",
        email: "",
      });
    } catch (error) {
      console.log("Error fetching users:", error);
      toast.error(error.response.data.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

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

          setData(
            data.map((user) =>
              user.id === userId ? { ...user, isactive } : user
            )
          );
          dispatch(setUser(updatedUsers));
        } catch (error) {
          console.log("Error updating user status:", error);
        }
      }
    },
    [data, dispatch, users]
  );

  const handleInputFocus = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <input
        onFocus={handleInputFocus}
        placeholder="Search using First Name, Last Name, Mobile Number or Email"
        className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 shadow-sm  focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
      />

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="overflow-y-auto data-[state=open]:animate-contentShow z-[100] fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[830px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Search User Using
            </Dialog.Title>
            <div className="flex md:flex-row flex-col justify-center items-center gap-1.5">
              <FormField
                value={searchQuery.firstname}
                onChange={handleChnage}
                name="firstname"
                htmlFor={"firstname"}
                placeholder={"First Name"}
                type={"text"}
              />
              <FormField
                value={searchQuery.lastname}
                onChange={handleChnage}
                name="lastname"
                htmlFor={"lastname"}
                placeholder={"Last Name"}
                type={"text"}
              />
              <FormField
                value={searchQuery.mo_number}
                onChange={handleChnage}
                name="mo_number"
                htmlFor={"mo_number"}
                placeholder={"Mobile"}
                type={"text"}
              />
              <FormField
                value={searchQuery.email}
                onChange={handleChnage}
                name="email"
                htmlFor={"email"}
                placeholder={"Email"}
                type={"text"}
              />
              <button
                onClick={getUsers}
                className="h-fit w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 mb-1.5 px-4 rounded-md"
              >
                Search
              </button>
            </div>
            <div>
              {loading ? (
                <Loader />
              ) : (
                <div
                  className={`${
                    updateUser
                      ? "hidden"
                      : "w-full flex flex-col justify-center items-center mx-auto"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-10">
                    {/* <h1 className="text-3xl font-bold text-center my-5">
                      All Users
                    </h1> */}
                    {/* <LinkButton to={"/add-user"}>Add Course</LinkButton> */}
                  </div>

                  {data.length > 0 ? (
                    <>
                      <div className="w-full overflow-auto mt-4">
                        <Table className="border border-gray-200 rounded">
                          <TableHeader>
                            <TableRow className="divide-x divide-gray-200">
                              <TableHead className="w-[50px]">Id</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Mobile No.</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Update</TableHead>
                              <TableHead>More</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="divide-y divide-gray-200">
                            {data.map((user, idx) => (
                              <TableRow
                                key={user.id}
                                className="divide-x divide-gray-200"
                              >
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell
                                  onClick={() =>
                                    navigate(`/users/${user.mo_number}`)
                                  }
                                  className="cursor-pointer"
                                >
                                  {user.firstname} {user.lastname}
                                </TableCell>
                                <TableCell>{user.mo_number}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col items-center space-y-1">
                                    <span className="text-xs font-medium">
                                      {user.isactive === "1"
                                        ? "Public"
                                        : "Private"}
                                    </span>
                                    <p className="text-xs font-bold">
                                      {user.isactive === "1"
                                        ? "Public"
                                        : "Private"}
                                    </p>
                                    <button
                                      onClick={() => {
                                        handleChangeStatus(
                                          user.id,
                                          user.isactive
                                        );
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
                                  <UpdateBtn
                                    handleClick={() => {
                                      setUpdateUserData(user);
                                      setUpdateUser(true);
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <More user={user} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-center mt-20">
                      No Data Available
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-center items-center">
                {updateUser && (
                  <UpdateUser
                    setUpdateUser={setUpdateUser}
                    updateUserData={updateUserData}
                  />
                )}
              </div>
            </div>

            <div className="mt-[25px] flex w-full gap-2.5">
              <Dialog.Close asChild>
                <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full">
                  Close
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                ref={addCloseRef}
                className="text-red-500 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <X />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default SearchUser;
