import * as Dialog from "@radix-ui/react-dialog";
import { Loader, UploadCloud, X } from "lucide-react";
import FormField from "../../utils/FormField";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import toast from "react-hot-toast";

function Add() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    img_url: "",
    type: "0",
    type_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const handleSubmit = async () => {};

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `${API_URL}/admin/courses/uplodecourseimage.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      // console.log(response.data);
      if (response.status === 200) {
        setData((prev) => ({ ...prev, img_url: response.data.url }));
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md">
          Add Slider
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow z-[100] fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Add Slider
          </Dialog.Title>

          <div>
            <select
              name="type"
              //   value={data.type}
              onChange={handleChange}
              className="w-96 h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
            >
              <option value={"0"}>None</option>
              <option value={"1"}>Course</option>
              <option value={"2"}>Batch</option>
              <option value={"3"}>Test</option>
            </select>
          </div>
          <div className="my-4 flex justify-between items-center">
            <input
              id="fileinput"
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="hidden"
            />
            <label
              htmlFor="fileinput"
              className="flex flex-col justify-center items-center w-60 h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
            >
              {!loading ? (
                <>
                  <UploadCloud />
                  <p>Upload Image</p>
                </>
              ) : (
                <>
                  <Loader className="animate-spin h-6 w-6" />
                  <p>Uploading...</p>
                </>
              )}
            </label>
            {data.img_url ? (
              <img
                src={data.img_url}
                alt="image"
                className="w-60 h-36 rounded-lg m-auto"
              />
            ) : (
              <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-60 text-center items-center m-auto">
                Preview
              </div>
            )}
          </div>
          <FormField
            htmlFor={"img_url"}
            id={"img_url"}
            type={"text"}
            placeholder={"Image Url"}
            name={"img_url"}
            value={data.img_url}
            onChange={handleChange}
          >
            Image Url
          </FormField>
          <div className="mt-[25px] flex w-full gap-2.5">
            <Dialog.Close asChild>
              <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-1/2">
                Close
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-1/2">
                Add
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-red-500 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              {/* <Cross2Icon /> */}
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Add;
