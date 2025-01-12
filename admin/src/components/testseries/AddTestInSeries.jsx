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
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";

const fetchTest = async (setTest, setLoading, directory_id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("directory_id", directory_id);
    formData.append("content_type", 3);
    const response = await axios.post(
      `${API_URL}/admin/directory/getcontenttoaddindir.php`,
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
  const [test, setTest] = useState([]);

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
        fetchTest(setTest, setLoading, testData.directory_id);
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
      <DialogContent className="h-[500px] overflow-y-auto">
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
              {test.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {test.map((test, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-center w-full border rounded-md border-gray-300 my-2 py-3 px-1"
                    >
                      <div className="flex justify-start items-center gap-4 w-full">
                        <div className="flex justify-center items-center w-fit">
                          <Avatar className="bg-gray-500 text-white">
                            {idx + 1}
                          </Avatar>
                        </div>
                        <div className="flex flex-col justify-start items-center gap-2 w-full">
                          <div className="flex justify-start items-center font-bold w-full cursor-pointer">
                            <div className="w-full">{test.test_name}</div>
                          </div>
                          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                          <div className="flex flex-wrap justify-between items-center gap-1 w-full text-xs font-medium">
                            <div className="flex justify-start items-start gap-1 w-fit">
                              <p>Start Date:</p>
                              <p>{test.test_date}</p>
                            </div>
                            <div className="flex justify-start items-start gap-1 w-fit">
                              <p>Start Time:</p>
                              <p>{test.start_time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-end gap-4 w-fit">
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
