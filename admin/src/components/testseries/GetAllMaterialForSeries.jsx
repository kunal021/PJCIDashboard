import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTest, setTest } from "../../redux/tests/testSlice";
// import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
// import LinkButton from "../../utils/LinkButton";
// import UpdateTest from "./UpdateTest";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
// import UpdateBtn from "../../utils/UpdateBtn";
// import ConfirmDelete from "../../utils/ConfirmDelete";
// import toast from "react-hot-toast";
// import LayoutAdjuster from "../../utils/LayoutAdjuster";
// import parser from "html-react-parser";
import { Avatar } from "antd";
import { useLocation } from "react-router-dom";
import { Card } from "../ui/card";
import toast from "react-hot-toast";
import ConfirmDelete from "@/utils/ConfirmDelete";

const fetchTest = async (dispatch, setLoading, directory_id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("directory_id", directory_id);
    formData.append("content_type", 5);
    const response = await axios.post(
      `${API_URL}/admin/directory/getdirectorycontent.php`,
      formData,
      { headers: "multipart/form-data" }
    );
    // console.log(response);
    dispatch(setTest(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetAllMaterialForSeries() {
  const location = useLocation();
  const { testData } = location.state || {};
  //   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //   const [updateTest, setUpdateTest] = useState(false);
  //   const [updateTestData, setUpdateTestData] = useState({});

  const dispatch = useDispatch();
  const material = useSelector((state) => state.test.test);

  useEffect(() => {
    fetchTest(dispatch, setLoading, testData.directory_id);
  }, [dispatch, testData.directory_id]);

  console.log(material);

  const handleDelete = async (materialId) => {
    try {
      const formData = new FormData();
      formData.append("directory_id", testData.directory_id);
      formData.append("content_type", 5);
      formData.append("content_id", materialId);
      const response = await axios.post(
        `${API_URL}/admin/directory/deletecontentfromdir.php`,
        formData,
        { headers: "multipart/form-data" }
      );
      // console.log(response);

      if (response.status === 201) {
        dispatch(deleteTest(materialId));
        toast.success("Material Deleted Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.massage || "Error deleting material");
      // console.error("Error fetching category:", error);
    }
  };

  const handleViewDoc = async (id) => {
    if (!id) {
      toast.error("Please select a document");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("doc_id", id);
      // formData.append("start_range", 0);
      // formData.append("end_range", 524287);

      const response = await axios.post(
        `${API_URL}/admin/docs/getdocurl.php`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Error while fetching document"
      );
    }
  };

  //   const handleChangeStatus = useCallback(
  //     async (materialId, flag) => {
  //       const confirmAlert = window.confirm(
  //         `${
  //           flag === "1"
  //             ? "Material will become Inactive. Do you want to proceed"
  //             : "Material will become Active. Do you want to proceed"
  //         }`
  //       );
  //       if (confirmAlert) {
  //         try {
  //           flag = flag === "1" ? "0" : "1";
  //           const formData = new FormData();
  //           formData.append("test_id", materialId);
  //           formData.append("statuscode", flag);
  //           await axios.post(
  //             `${API_URL}/admin/material/updateteststatus.php`,
  //             formData,
  //             { headers: { "content-type": "multipart/form-data" } }
  //           );
  //           // console.log(res);

  //           // Update local state instead of fetching users again
  //           const updatedTest = material.map((material) =>
  //             material.test_id === materialId ? { ...material, flag } : material
  //           );
  //           dispatch(setTest(updatedTest));
  //         } catch (error) {
  //           console.log("Error updating user status:", error);
  //           // Handle error (e.g., show an error message)
  //         }
  //       }
  //     },
  //     [dispatch, material]
  //   );

  // console.log(material);

  return (
    <Card className="w-full border-gray-300">
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${"w-full flex flex-col justify-center items-center my-5"} `}
        >
          <div className="flex justify-center items-center gap-10">
            {/* <h1 className="text-3xl font-bold text-center">Material List</h1>
            <LinkButton to={"/add-material"}>Add Material</LinkButton> */}
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
                        <div
                          onClick={() => handleViewDoc(material.doc_id)}
                          className="w-full"
                        >
                          {material.name}
                        </div>
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
                    {/* <UpdateBtn
                      handleClick={() => {
                        setUpdateTest((prev) => !prev);
                        // setUpdateTestData(material);
                      }}
                    /> */}
                    <ConfirmDelete
                      handleClick={() => handleDelete(material.test_id)}
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
    </Card>
  );
}

export default GetAllMaterialForSeries;
