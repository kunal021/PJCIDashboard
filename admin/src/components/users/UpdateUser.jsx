import FormField from "../../utils/FormField";

// eslint-disable-next-line react/prop-types
function UpdateUser({ updateUserData, setUpdateUser }) {
  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Student</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          <div className="flex items-center justify-between">
            <div className="w-full my-2">
              <FormField
                htmlFor={"course_name"}
                id={"course_name"}
                type={"text"}
                placeholder={"Name"}
                name={"course_name"}
                // value={course.course_name}
                // onChange={handleChange}
              >
                Name
              </FormField>
            </div>
            <button
              // onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update User
            </button>
          </div>
        </div>
        <button
          onClick={() => setUpdateUser((perv) => !perv)}
          className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateUser;
