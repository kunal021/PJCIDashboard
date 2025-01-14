/* eslint-disable react/prop-types */
import { useState } from "react";
import FormField from "../../utils/FormField";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/users/userSlice";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import UpdateBtn from "@/utils/UpdateBtn";

function UpdateUser({ updateUserData }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    first_name: updateUserData.firstname,
    last_name: updateUserData.lastname,
    email: updateUserData.email,
    mobile: updateUserData.mo_number,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (user.mobile.length !== 10 || !/^[6789]/.test(user.mobile)) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstname", user.first_name);
      formData.append("lastname", user.last_name);
      formData.append("email", user.email);
      formData.append("number", user.mobile);
      formData.append("id", updateUserData.id);
      const response = await axios.post(
        `${API_URL}/admin/user/updateuser.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        dispatch(
          updateUser({
            id: updateUserData.id,
            firstname: user.first_name,
            lastname: user.last_name,
            email: user.email,
            mo_number: user.mobile,
            isactive: updateUserData.isactive,
          })
        );
        toast.success("User updated successfully");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <UpdateBtn />
        </div>
      </SheetTrigger>
      <SheetContent className="z-[100] w-full sm:w-[70%] overflow-auto">
        <SheetHeader className="text-2xl font-bold text-center lg:text-left">
          Update Student
        </SheetHeader>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-full max-w-lg">
            <div className="w-full">
              {/* Form Section */}
              <div className="flex flex-col items-center justify-between">
                <div className="w-full my-4">
                  <FormField
                    htmlFor="first_name"
                    id="first_name"
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleChange}
                  >
                    First Name
                  </FormField>
                  <FormField
                    htmlFor="last_name"
                    id="last_name"
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleChange}
                  >
                    Last Name
                  </FormField>
                  <FormField
                    htmlFor="mobile"
                    id="mobile"
                    type="text"
                    placeholder="Mobile"
                    name="mobile"
                    value={user.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    minLength={10}
                  >
                    Mobile Number
                  </FormField>
                  {(user.mobile.length > 10 ||
                    user.mobile.length < 10 ||
                    !/^[6789]/.test(user.mobile)) && (
                    <p className="text-red-500 text-sm mt-1">
                      Invalid Mobile Number
                    </p>
                  )}
                  <FormField
                    htmlFor="email"
                    id="email"
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                  >
                    Email
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex w-full gap-4 mt-4">
          <button
            disabled={loading}
            onClick={() => setOpen(false)}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Close
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Update
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default UpdateUser;
