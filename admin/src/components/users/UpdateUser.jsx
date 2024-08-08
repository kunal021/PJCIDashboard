import { useState } from "react";
import FormField from "../../utils/FormField";

// eslint-disable-next-line react/prop-types
function UpdateUser({ updateUserData, setUpdateUser }) {
  const [user, setUser] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Student</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          <div className="flex flex-col items-center justify-between">
            <div className="w-full my-2">
              <FormField
                htmlFor={"user_name"}
                id={"user_name"}
                type={"text"}
                placeholder={"Name"}
                name={"user_name"}
                value={user}
                onChange={handleChange}
              >
                Name
              </FormField>
            </div>
            <button
              // onClick={handleSubmit}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
            >
              Update User
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
