/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/url";
import Loader from "@/utils/Loader";
import { Avatar } from "antd";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getData = async (type, is_paid, setLoading, setData) => {
  try {
    setLoading(true);
    const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    formData.append("type", type);
    formData.append("is_paid", is_paid);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoctoaddindirectory.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    if (type == 1) {
      setData(response.data.data);
    }
    if (type == 2) {
      setData(response.data.data);
    }
  } catch (error) {
    // console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetDataToAdd({ directory_id, data, setData }) {
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState([]);
  const [note, setNote] = useState([]);
  useEffect(() => {
    getData(1, 2, setLoading, setMaterial);
    getData(2, 2, setLoading, setNote);
  }, []);

  const handleAddDoc = async (id, type) => {
    console.log(id, type);
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("directory_id", directory_id);
      formData.append("content_type", 5);
      formData.append("content_id", id);

      const response = await axios.post(
        `${API_URL}/admin/directory/addcontentindirectory.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      //   console.log(response);
      if (response.status === 201) {
        toast.success("Document Uploaded Successfully");

        if (type == 1) {
          setMaterial((prev) => prev.filter((item) => item.id !== id));
          const addData = material.filter((item) => item.id === id);
          setData((prev) => [...prev, addData]);
        }
        if (type == 2) {
          setNote((prev) => prev.filter((item) => item.id !== id));
          const addData = note.filter((item) => item.id === id);
          setData((prev) => [...prev, addData]);
        }
      }
    } catch (error) {
      //   console.log(error);
      toast.error(error?.response?.data?.message || "Error Uploading Document");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="w-14 h-14 border border-black text-xs border-dashed text-center">
        Add Content
      </DialogTrigger>
      <DialogContent className="h-[80%] z-[100]">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="Material" className="w-full">
          <TabsList className="w-full justify-evenly sticky top-0 z-10">
            <TabsTrigger value="Material">Materials</TabsTrigger>
            <TabsTrigger value="Note">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="Material">
            {loading ? (
              <Loader className="w-full h-full" />
            ) : (
              <div className="w-full flex flex-col justify-center items-center">
                {material.length > 0 ? (
                  <div className="flex flex-col justify-center items-center w-full">
                    {material.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                      >
                        <div className="flex flex-col justify-center items-start gap-4 w-full">
                          <div className="flex justify-between items-center w-full gap-4">
                            <Avatar className="bg-gray-500 text-white">
                              {/* {(currentPage - 1) * 10 + (idx + 1)} */}
                              {idx + 1}
                            </Avatar>
                          </div>
                          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                          <div
                            // onClick={() => handleViewDoc(item.id)}
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
                        <button
                          onClick={() => {
                            handleAddDoc(item.id, 1);
                          }}
                          className="rounded-full bg-green-200 p-1 items-center"
                        >
                          <Plus />
                        </button>
                      </div>
                    ))}
                    {/* <div>
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div> */}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-center mt-20">
                    No Data Available
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="Note">
            {loading ? (
              <Loader className="w-full h-full" />
            ) : (
              <div className="w-full flex flex-col justify-center items-center">
                {note.length > 0 ? (
                  <div className="flex flex-col justify-center items-center w-full">
                    {note.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                      >
                        <div className="flex flex-col justify-center items-start gap-4 w-full">
                          <div className="flex justify-between items-center w-full gap-4">
                            <Avatar className="bg-gray-500 text-white">
                              {/* {(currentPage - 1) * 10 + (idx + 1)} */}
                              {idx + 1}
                            </Avatar>
                          </div>
                          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                          <div
                            // onClick={() => handleViewDoc(item.id)}
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
                        <button
                          onClick={() => {
                            handleAddDoc(item.id, 2);
                          }}
                          className="rounded-full bg-green-200 p-1 items-center"
                        >
                          <Plus />
                        </button>
                      </div>
                    ))}
                    {/* <div>
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div> */}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-center mt-20">
                    No Data Available
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default GetDataToAdd;
