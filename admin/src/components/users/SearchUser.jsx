import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateSlider } from "../../redux/slider/sliderSlice";
import { X } from "lucide-react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";

function SearchUser() {
  const dispatch = useDispatch();
  const addCloseRef = useRef();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!data.img_url || !data.type) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("img_url", data.img_url);
      formData.append("type", data.type);
      formData.append("type_id", data.type_id);
      const response = await axios.post(
        `${API_URL}/admin/slider/addslider.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      console.log(response);
      if (response.status === 200) {
        dispatch(updateSlider(data));
        toast.success("Slider Updated Successfully");
        addCloseRef.current.click();
        setIsDialogOpen(false); // Close dialog after successful update
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error updating slider");
    }
  };

  const handleInputFocus = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <input
        onFocus={handleInputFocus}
        placeholder="Search using First Name, Last Name, Mobile Number or Email"
        className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 shadow-sm  focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
      />

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow z-[100] fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[830px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Search User
            </Dialog.Title>
            <div>
              <FormField />
            </div>

            <div className="mt-[25px] flex w-full gap-2.5">
              <Dialog.Close asChild>
                <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full">
                  Close
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                ref={addCloseRef}
                className="text-red-500 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <X />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default SearchUser;
