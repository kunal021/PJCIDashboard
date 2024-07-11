/* eslint-disable react/prop-types */
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { API_URL } from "../../url";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { Avatar } from "antd";
import parser from "html-react-parser";
import Pagination from "../../utils/Pagination";

const fetchData = async (
  setLoading,
  coursetype,
  categoryid,
  setError,
  setPaginationData,
  setCourse,
  setFullCourse
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_type", coursetype);
    formData.append("c_id", categoryid);
    formData.append("limit", 10);
    // formData.append("course_type", coursetype);
    const response = await axios.post(
      `${API_URL}/admin/category/getcourseavailabletoadd.php`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (coursetype == 1) {
      setCourse(response.data.data);
      setPaginationData(response.data.pagination);
    }
    if (coursetype == 0) {
      setFullCourse(response.data.data);
      setPaginationData(response.data.pagination);
    }
  } catch (error) {
    console.log(error);
    setError(error.response.data.massage);
  } finally {
    setLoading(false);
  }
};

function Tab({ categoryId }) {
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const [course, setCourse] = useState([]);
  const [fullCourse, setFullCourse] = useState([]);

  console.log(course);
  console.log(fullCourse);
  console.log(categoryId);

  useEffect(() => {
    fetchData(
      setLoading,
      1,
      categoryId,
      setError,
      setPaginationData,
      setCourse,
      setFullCourse
    );
    fetchData(
      setLoading,
      0,
      categoryId,
      setError,
      setPaginationData,
      setCourse,
      setFullCourse
    );
  }, [categoryId]);

  const handleAddCourse = async (course_type, courseid, categoryid) => {
    try {
      const formData = new FormData();
      formData.append("course_id", courseid);
      formData.append("c_id", categoryid);
      formData.append("course_type", course_type);
      const response = await axios.post(
        `${API_URL}/admin/category/addcourseincategory.php`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // const isCourseAdded = (cid) => {
  //   return courses.some((course) => course.id === cid);
  // };
  return (
    <Tabs.Root
      className="flex flex-col w-full shadow-[0_2px_10px] shadow-blackA2 mt-2"
      defaultValue="tab1"
    >
      <Tabs.List
        className="shrink-0 flex border-b border-mauve6"
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
          value="tab1"
          // onClick={() => fetchData(setLoading, dispatch, 1)}
        >
          Course
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
          value="tab2"
          // onClick={() => fetchData(setLoading, dispatch, 0)}
        >
          Full Course
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab1"
      >
        {loading ? (
          <Loader className="animate-spin text-blue-500" />
        ) : (
          <div
            className={`w-full flex flex-col justify-center items-center mx-auto`}
          >
            <div className="w-full flex flex-col justify-center items-center my-2">
              <div className="w-full flex flex-col justify-center items-center">
                {course.length > 0 ? (
                  <div className="flex flex-col justify-center items-center w-full">
                    {course.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-2 p-3 gap-3"
                      >
                        <div className="flex flex-col justify-center items-start gap-4 w-[90%]">
                          <div className="flex justify-start items-center text-sm w-full gap-4">
                            <div className="flex justify-center items-center">
                              <Avatar className="bg-gray-500 text-white w-8 h-8">
                                {idx + 1}
                              </Avatar>
                            </div>
                            <div className="flex flex-wrap text-wrap">
                              {typeof item.course_name == "string"
                                ? parser(item.course_name)
                                : item.course_name}
                            </div>
                          </div>
                        </div>
                        <button
                          // disabled={isCourseAdded(item.id)}
                          onClick={() =>
                            handleAddCourse(1, item.id, categoryId)
                          }
                          className="rounded-full bg-green-200 p-1 items-center"
                        >
                          {/* {isCourseAdded(item.id) ? <Check /> : <Plus />} */}
                          <Plus />
                        </button>
                      </div>
                    ))}
                    <div>
                      <Pagination
                        totalPage={paginationData.total_pages}
                        currPage={currentPage}
                        setCurrPage={setCurrentPage}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-center mt-20">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Tabs.Content>
      <Tabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      >
        {loading ? (
          <Loader className="animate-spin text-blue-500" />
        ) : (
          <div
            className={`w-full flex flex-col justify-center items-center mx-auto`}
          >
            <div className="w-full flex flex-col justify-center items-center my-2">
              <div className="w-full flex flex-col justify-center items-center">
                {fullCourse.length > 0 ? (
                  <div className="flex flex-col justify-center items-center w-full">
                    {fullCourse.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-2 p-3 gap-3"
                      >
                        <div className="flex flex-col justify-center items-start gap-4 w-[90%]">
                          <div className="flex justify-start items-center text-sm w-full gap-4">
                            <div className="flex justify-center items-center">
                              <Avatar className="bg-gray-500 text-white w-8 h-8">
                                {idx + 1}
                              </Avatar>
                            </div>
                            <div className="flex flex-wrap text-wrap">
                              {typeof item.full_course_name == "string"
                                ? parser(item.full_course_name)
                                : item.full_course_name}
                            </div>
                          </div>
                        </div>
                        <button
                          // disabled={isCourseAdded(item.id)}
                          onClick={() =>
                            handleAddCourse(0, item.id, categoryId)
                          }
                          className="rounded-full bg-green-200 p-1 items-center"
                        >
                          {/* {isCourseAdded(item.id) ? <Check /> : <Plus />} */}
                          <Plus />
                        </button>
                      </div>
                    ))}
                    <div>
                      <Pagination
                        totalPage={paginationData.total_pages}
                        currPage={currentPage}
                        setCurrPage={setCurrentPage}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-center mt-20">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default Tab;
