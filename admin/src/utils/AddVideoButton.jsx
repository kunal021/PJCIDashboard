import { SquarePlay } from "lucide-react";

// eslint-disable-next-line react/prop-types
function AddVideo({ childern }) {
  return (
    <button className="bg-green-500 hover:bg-green-700 text-white font-bold p-1 text-xs rounded group relative">
      <SquarePlay />
      <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white text-black rounded p-1">
        {childern}
      </p>
    </button>
  );
}

export default AddVideo;
