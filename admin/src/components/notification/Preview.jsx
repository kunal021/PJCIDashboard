/* eslint-disable react/prop-types */
function Preview({ imgUrl, title, body }) {
  return (
    <div className="w-[375px] border rounded-lg p-4 shadow-sm font-sans bg-white">
      {/* Header Section */}
      <div className="flex items-center mb-3">
        <img
          src={"../../../public/fav.jpg"}
          alt="Icon"
          className="w-4 h-4 bg-gray-300 mr-2"
        />
        <span className="text-sm">Pankaj Joshi e-Classes</span>
      </div>

      {/* Body Section */}
      <div>
        <h4 className="text-base font-semibold mb-1 break-words">{title}</h4>
        <p className="text-sm text-gray-600 break-words">{body}</p>
        {imgUrl && (
          <img
            src={imgUrl}
            alt="Preview"
            className="mt-4 h-40 w-full rounded-md"
          />
        )}
      </div>
    </div>
  );
}

export default Preview;
