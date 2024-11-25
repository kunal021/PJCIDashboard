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

const fetchTest = async (setMaterial, setLoading, directory_id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("directory_id", directory_id);
    formData.append("content_type", 5);
    const response = await axios.post(
      `${API_URL}/admin/directory/getcontenttoaddindir.php`,
      formData,
      { headers: "multipart/form-data" }
    );
    // console.log(response);
    setMaterial(response.data.data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function AddMaterialInSeries() {
  const location = useLocation();
  const { testData } = location.state || {};
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [material, setMaterial] = useState([]);
  // console.log(material);

  useEffect(() => {
    fetchTest(setMaterial, setLoading, testData.directory_id);
  }, [testData.directory_id]);

  const handleAddMaterial = async (materialId) => {
    try {
      const formData = new FormData();
      formData.append("directory_id", testData.directory_id);
      formData.append("content_type", 5);
      formData.append("content_id", materialId);
      const response = await axios.post(
        `${API_URL}/admin/directory/addcontentindirectory.php`,
        formData,
        { headers: "multipart/form-data" }
      );
      // console.log(response);
      if (response.status === 201) {
        fetchTest(setMaterial, setLoading, testData.directory_id);
        const addedMaterial = material.find((t) => t.id === materialId);
        dispatch(
          addTest({
            id: materialId,
            name: addedMaterial.name,
            description: addedMaterial.description,
            price: addedMaterial.price,
            size: addedMaterial.size,
            duration: addedMaterial.duration,
          })
        );
        setMaterial((prevTest) =>
          prevTest.filter((t) => t.test_id !== material)
        );
        toast.success("Test Added Successfully");
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error(error.response.data.massage || "Error adding material");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Plus />
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>
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
            <LinkButton to={"/add-material"}>Add Test</LinkButton> */}
              </div>
              {material.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {material.map((material, idx) => (
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
                            <div className="w-full">{material.name}</div>
                            {/* <div className="w-[20%]">
                          <button
                            onClick={() => {
                              handleChangeStatus(material.test_id, material.flag);
                            }}
                            className="toggle-switch scale-75 align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={material.flag === "1"}
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
                              <p>Price:</p>
                              <p>{material.price}</p>
                            </div>
                            <div className="flex justify-start items-start gap-1 w-full">
                              <p>Size:</p>
                              <p>{material.size}</p>
                            </div>
                            <div className="flex justify-start items-start gap-1 w-full">
                              <p>Duration:</p>
                              <p>{material.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-end gap-4 w-[10%]">
                        <Plus
                          onClick={() => handleAddMaterial(material.id)}
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

export default AddMaterialInSeries;
