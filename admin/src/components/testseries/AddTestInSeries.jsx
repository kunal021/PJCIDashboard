import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar } from "antd";
import Loader from "@/utils/Loader";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/url";
import { addTest } from "@/redux/tests/testSlice";
import toast from "react-hot-toast";

const fetchTest = async (setTest, setLoading, directory_id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("dir_id", directory_id);
    formData.append("id", 1);
    const response = await axios.post(
      `${API_URL}/admin/testseries/gettestavailabletoadd.php`,
      formData,
      { headers: "multipart/form-data" }
    );
    // console.log(response);
    setTest(response.data.data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function AddTestInSeries() {
  const location = useLocation();
  const { testData } = location.state || {};
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [test, setTest] = useState([]);
  // console.log(test);

  useEffect(() => {
    fetchTest(setTest, setLoading, testData.directory_id);
  }, [testData.directory_id]);

  const handleAddTest = async (testId) => {
    try {
      const formData = new FormData();
      formData.append("directory_id", testData.directory_id);
      formData.append("content_type", 3);
      formData.append("content_id", testId);
      const response = await axios.post(
        `${API_URL}/admin/directory/addcontentindirectory.php`,
        formData,
        { headers: "multipart/form-data" }
      );
      // console.log(response);
      if (response.status === 201) {
        dispatch(
          addTest({
            test_id: testId,
            test_name: test.find((t) => t.test_id === testId).test_name,
            test_description: test.find((t) => t.test_id === testId)
              .test_description,
            test_date: test.find((t) => t.test_id === testId).test_date,
            start_time: test.find((t) => t.test_id === testId).start_time,
            end_time: test.find((t) => t.test_id === testId).end_time,
          })
        );
        setTest((prevTest) => prevTest.filter((t) => t.test_id !== testId));
        toast.success("Test Added Successfully");
      }
    } catch (error) {
      console.error("Error adding test:", error);
      toast.error(error.response.data.massage || "Error adding test");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Plus />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Test</DialogTitle>
        </DialogHeader>
        <div className="w-full border-gray-300">
          {loading ? (
            <Loader />
          ) : (
            <div
              className={`${"w-full flex flex-col justify-center items-center my-5"} `}
            >
              <div className="flex justify-center items-center gap-10">
                {/* <h1 className="text-3xl font-bold text-center">Test List</h1>
            <LinkButton to={"/add-test"}>Add Test</LinkButton> */}
              </div>
              {test.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {test.map((test, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-center w-[90%] border rounded-md border-gray-300 m-2 p-3"
                    >
                      <div className="flex justify-start items-center gap-4 w-full">
                        <div className="flex justify-center items-center w-[10%] text-">
                          <Avatar className="bg-gray-500 text-white">
                            {idx + 1}
                          </Avatar>
                        </div>
                        <div className="flex flex-col justify-start items-center gap-2 w-full">
                          <div className="flex justify-start items-center font-bold w-full cursor-pointer">
                            <div className="w-full">{test.test_name}</div>
                            {/* <div className="w-[20%]">
                          <button
                            onClick={() => {
                              handleChangeStatus(test.test_id, test.flag);
                            }}
                            className="toggle-switch scale-75 align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={test.flag === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div> */}
                          </div>
                          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                          <div className="flex justify-start items-center gap-1 w-full text-xs font-medium">
                            <div className="flex justify-start items-start gap-1 w-full">
                              <p>Start Date:</p>
                              <p>{test.test_date}</p>
                            </div>
                            <div className="flex justify-start items-start gap-1 w-full">
                              <p>Start Time:</p>
                              <p>{test.start_time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-end gap-4 w-[10%]">
                        <Plus
                          onClick={() => handleAddTest(test.test_id)}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-2xl font-bold text-center mt-20">
                  No Data Available
                </div>
              )}
            </div>
          )}
        </div>
        <DialogClose className="bg-red-500 p-2 rounded-md text-white">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AddTestInSeries;
