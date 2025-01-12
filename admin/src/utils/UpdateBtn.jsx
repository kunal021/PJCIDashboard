/* eslint-disable react/prop-types */
import { SquarePen } from "lucide-react";

function UpdateBtn({ handleClick, type }) {
  return (
    <button
      onClick={handleClick}
      type={type}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-xs rounded group relative max-sm:scale-75"
    >
      <SquarePen />
      <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white/50 text-black rounded p-1">
        Update
      </p>
    </button>
  );
}

export default UpdateBtn;
