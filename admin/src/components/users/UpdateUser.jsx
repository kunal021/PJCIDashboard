/* eslint-disable react/prop-types */
import { useState } from "react";
import FormField from "../../utils/FormField";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/users/userSlice";

function UpdateUser({ updateUserData, setUpdateUser }) {
  const [user, setUser] = useState({
    first_name: updateUserData.firstname,
    last_name: updateUserData.Lastname,
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

      console.log(response);
      if (response.status === 201) {
        dispatch(
          updateUser({
            id: updateUserData.id,
            firstname: user.first_name,
            Lastname: user.last_name,
            email: user.email,
            mo_number: user.mobile,
            isactive: updateUserData.isactive,
          })
        );
        toast.success("User updated successfully");
        setUpdateUser(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Student</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          <div className="flex flex-col items-center justify-between">
            <div className="w-full my-2">
              <FormField
                htmlFor={"first_name"}
                id={"first_name"}
                type={"text"}
                placeholder={"First Name"}
                name={"first_name"}
                value={user.first_name}
                onChange={handleChange}
              >
                First Name
              </FormField>
              <FormField
                htmlFor={"last_name"}
                id={"last_name"}
                type={"text"}
                placeholder={"Last Name"}
                name={"last_name"}
                value={user.last_name}
                onChange={handleChange}
              >
                Last Name
              </FormField>
              <FormField
                htmlFor={"mobile"}
                id={"mobile"}
                type={"text"}
                placeholder={"Mobile"}
                name={"mobile"}
                value={user.mobile}
                onChange={handleChange}
              >
                Mobile Number
              </FormField>
              <FormField
                htmlFor={"email"}
                id={"email"}
                type={"text"}
                placeholder={"Email"}
                name={"email"}
                value={user.email}
                onChange={handleChange}
              >
                Email
              </FormField>
            </div>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </div>
        <button
          onClick={() => setUpdateUser((perv) => !perv)}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateUser;
