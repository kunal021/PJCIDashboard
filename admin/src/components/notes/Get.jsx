import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateDoc from "./Update";
import Add from "./Add";
import { useHeading } from "@/hooks/use-heading";

const fetchData = async (setLoading, setDoc) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("type", 2);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoc.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    setDoc(response.data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetNotes() {
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState([]);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-3xl font-bold text-center">Notes List</h1>
        <Add setDoc={setDoc} />
      </div>
    );
    fetchData(setLoading, setDoc);
  }, [setHeading]);

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/docs/deletedoc.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );
      console.log(response);
      if (response.status === 200) {
        const newdoc = doc.filter((doc) => doc.id !== id);
        setDoc(newdoc);
        toast.success("Document Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Error while deleting document"
      );
    }
  };

  const handleChangeStatus = async (docId, is_active) => {
    const confirmAlert = window.confirm(
      `${
        is_active === "1"
          ? "Notes will become Inactive. Do you want to proceed"
          : "Notes will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("id", docId);
        formData.append("status_code", is_active);
        await axios.post(
          `${API_URL}/admin/docs/updatedocstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        const updatedVideo = doc.map((doc) =>
          doc.id === docId ? { ...doc, is_active } : doc
        );
        setDoc(updatedVideo);
      } catch (error) {
        console.log("Error updating Doc status:", error);
      }
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

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div
          className={`${"w-[80%] flex flex-col justify-center items-center mx-auto"} `}
        >
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex flex-col justify-center items-center">
              {doc.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {doc.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                    >
                      <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <div className="flex justify-between items-center w-full gap-4">
                          <Avatar className="bg-gray-500 text-white">
                            {idx + 1}
                          </Avatar>
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-xs font-bold">
                              {item.is_active === "1" ? "Public" : "Private"}
                            </p>
                            <button
                              onClick={() => {
                                handleChangeStatus(item.id, item.is_active);
                              }}
                              className="toggle-switch scale-75 align-middle"
                            >
                              <input
                                type="checkbox"
                                checked={item.is_active === "1"}
                                readOnly
                              />
                              <div className="toggle-switch-background">
                                <div className="toggle-switch-handle"></div>
                              </div>
                            </button>
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div
                          onClick={() => handleViewDoc(item.id)}
                          className="cursor-pointer flex justify-between items-center w-full gap-6"
                        >
                          <div className="flex justify-center items-center w-48">
                            <img
                              src={item.img_url}
                              className="rounded-lg border-transparent h-24 w-full"
                            />
                          </div>
                          <div className="flex flex-wrap text-wrap w-full">
                            {item.name}
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className=" cursor-pointer flex justify-between items-center w-full gap-6">
                          <div className="flex justify-center items-center">
                            Price: {item.price}
                          </div>
                          <div className="flex justify-center items-center">
                            Duration: {item.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit">
                        <UpdateDoc data={item} setData={setDoc} />
                        <ConfirmDelete
                          handleClick={() => handleDelete(item.id)}
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
          </div>
        </div>
      )}
    </>
  );
}

export default GetNotes;
