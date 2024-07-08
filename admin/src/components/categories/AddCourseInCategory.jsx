/* eslint-disable react/prop-types */
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { Check, Plus, SquarePlay, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../../url";
import { setCourse } from "../../redux/courses/courseSlice";
import { useEffect, useState } from "react";
import Loader from "../../utils/Loader";
import parser from "html-react-parser";
import { Avatar } from "antd";
import Tab from "./Tab";

const fetchData = async (setLoading, dispatch) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_type", 0);
    const response = await axios.post(
      `${API_URL}/admin/courses/getallcourse.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    dispatch(setCourse(response.data.data));
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function AddCourseInCategory({ courseId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const courses = useSelector((state) => state.courses.courses);

  console.log(courses);

  useEffect(() => {
    fetchData(setLoading, dispatch);
  }, [dispatch]);

  const handleAddVideo = async (vid, cid) => {
    try {
      const formData = new FormData();
      formData.append("c_id", cid);
      formData.append("v_id", vid);
      const response = await axios.post(
        `${API_URL}/admin/courses/addvideoincourse.php`,
        formData,
        { headers: "content-type/form-data" }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  //   const isVideoAdded = (vid) => {
  //     return addVideoInCourse.some((courses) => video.id === vid);
  //   };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-white bg-green-500 hover:bg-green-700 items-center text-xs font-bold justify-center rounded p-1 group relative">
          <SquarePlay />
          <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white text-black rounded p-1">
            Add Course
          </p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] overflow-auto left-[55%] max-h-[95vh] w-[90vw] max-w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          {/* <Dialog.Title className="text-mauve12 m-0 text-2xl font-bold">
            Add Course
          </Dialog.Title> */}
          <Tab />
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="bg-red-500 text-white hover:bg-red-700  inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="text-black hover:bg-blue-100  absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddCourseInCategory;
