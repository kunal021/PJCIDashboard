/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/url";
import FormField from "@/utils/FormField";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

function AddSubject({ setSubjects, subjects }) {
  const closeRef = useRef(null);
  const [name, setName] = useState("");

  const handleAddName = async () => {
    if (!name) return;
    const duplicate = subjects.find((subject) => subject.subject_name === name);
    if (duplicate) {
      toast.error("Subject already exists");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("s_name", name);
      const response = await axios.post(
        `${API_URL}/admin/test/addtestsubject.php`,
        formData,
        { headers: "multipart/form-data" }
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("Subject added successfully");
        setSubjects((prev) => [...prev, { subject_name: name }]);
        if (closeRef.current) {
          closeRef.current.click();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error adding subject");
    }
  };
//   console.log(subjects);
  return (
    <Dialog className="z-[100]">
      <DialogTrigger className="bg-blue-50 hover:bg-blue-100 text-black border font-semibold py-2 px-4 rounded-md  border-blue-200">
        Add Subject
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>
        <div>
          <FormField
            htmlFor={"name"}
            name={"name"}
            id={"name"}
            placeholder={"Subject Name"}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            Subject Name
          </FormField>
        </div>
        <div className="flex justify-end gap-6">
          <DialogClose className="w-full bg-red-50 hover:bg-red-100 text-black border font-semibold py-2 px-4 rounded-md  border-red-200">
            Close
          </DialogClose>
          <button
            onClick={handleAddName}
            className="w-full bg-blue-50 hover:bg-blue-100 text-black border font-semibold py-2 px-4 rounded-md  border-blue-200"
          >
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddSubject;
