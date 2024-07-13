/* eslint-disable react/prop-types */
import * as Dialog from "@radix-ui/react-dialog";
import { SquarePlay, X } from "lucide-react";
import Tab from "./Tab";

function AddCourseInCategory({ categoryId }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-white bg-green-500 hover:bg-green-700 items-center text-xs font-bold justify-center rounded p-1 group relative">
          <SquarePlay />
          <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white/50 text-black text-xs rounded p-1">
            Add Course
          </p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] overflow-auto left-[55%] max-h-[95vh] w-[90vw] max-w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Tab categoryId={categoryId} />
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="bg-red-500 text-white hover:bg-red-700  inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="text-black hover:bg-blue-100  absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddCourseInCategory;
