/* eslint-disable react/prop-types */
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { API_URL } from "../../url";
import { useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import { Avatar } from "antd";
// import parser from "html-react-parser";
import Pagination from "../../utils/Pagination";
import toast from "react-hot-toast";

const fetchData = async (
  setLoading,
  coursetype,
  categoryid,
  // setError,
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
    const response = await axios.post(
      `${API_URL}/admin/category/getcourseavailabletoadd.php`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (response.status === 200) {
      if (coursetype == 1) {
        setCourse(response.data.data);
        setPaginationData(response.data.pagination);
      }
      if (coursetype == 0) {
        setFullCourse(response.data.data);
        setPaginationData(response.data.pagination);
      }
    }
  } catch (error) {
    console.log(error);
    // setError(error.response.data.message);
  } finally {
    setLoading(false);
  }
};

function Tab({ categoryId }) {
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [course, setCourse] = useState([]);
  const [fullCourse, setFullCourse] = useState([]);

  useEffect(() => {
    fetchData(
      setLoading,
      1,
      categoryId,
      setPaginationData,
      setCourse,
      setFullCourse
    );
    fetchData(
      setLoading,
      0,
      categoryId,
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

      if (response.status === 200) {
        if (course_type == 1) {
          setCourse(course.filter((item) => item.id !== courseid));
          toast.success("Course Added Successfully");
        }
        if (course_type == 0) {
          setFullCourse(fullCourse.filter((item) => item.id !== courseid));
          toast.success("Full Course Added Successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Tabs defaultValue="tab1" className="w-full mt-2">
      <TabsList className="flex">
        <TabsTrigger value="tab1" className="flex-1">
          Course
        </TabsTrigger>
        <TabsTrigger value="tab2" className="flex-1">
          Full Course
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        {loading ? (
          <Loader className="animate-spin text-blue-500 text-center w-full" />
        ) : (
          <div className="w-full flex flex-col justify-center items-center mx-auto">
            <div className="w-full flex flex-col justify-center items-center my-2">
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
                              {(currentPage - 1) * 10 + (idx + 1)}
                            </Avatar>
                          </div>
                          <div className="flex flex-wrap text-wrap">
                            {item.course_name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddCourse(1, item.id, categoryId)}
                        className="rounded-full bg-green-200 p-1 items-center"
                      >
                        <Plus />
                      </button>
                    </div>
                  ))}
                  <Pagination
                    totalPage={paginationData.total_pages}
                    currPage={currentPage}
                    setCurrPage={setCurrentPage}
                  />
                </div>
              ) : (
                <div className="text-2xl font-bold text-center mt-20">
                  No Data Available
                </div>
              )}
            </div>
          </div>
        )}
      </TabsContent>
      <TabsContent value="tab2">
        {loading ? (
          <Loader className="animate-spin text-blue-500" />
        ) : (
          <div className="w-full flex flex-col justify-center items-center mx-auto">
            <div className="w-full flex flex-col justify-center items-center my-2">
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
                              {(currentPage - 1) * 10 + (idx + 1)}
                            </Avatar>
                          </div>
                          <div className="flex flex-wrap text-wrap">
                            {item.full_course_name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddCourse(0, item.id, categoryId)}
                        className="rounded-full bg-green-200 p-1 items-center"
                      >
                        <Plus />
                      </button>
                    </div>
                  ))}
                  <Pagination
                    totalPage={paginationData.total_pages}
                    currPage={currentPage}
                    setCurrPage={setCurrentPage}
                  />
                </div>
              ) : (
                <div className="text-2xl font-bold text-center mt-20">
                  No Data Available
                </div>
              )}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default Tab;
