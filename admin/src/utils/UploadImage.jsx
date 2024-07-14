/* eslint-disable react/prop-types */
import { UploadCloud } from "lucide-react";

function UploadImage({ handleUploadImage, imgurl }) {
  return (
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
        className="flex flex-col justify-center items-center w-60 h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-gray-100"
      >
        <UploadCloud />
        <p>Upload Image</p>
      </label>
      <img src={imgurl} alt="image" className="w-60 h-36 rounded-lg" />
    </div>
  );
}

export default UploadImage;
