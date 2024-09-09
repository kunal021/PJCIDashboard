/* eslint-disable react/prop-types */
const MakeUserPurchaseResponse = ({ data, onClose }) => {
  const obj = JSON.parse(data?.users_notfound);
  const valuesArray = Object.values(obj);
  console.log(valuesArray);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ml-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] mx-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {data?.message}
        </h2>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-semibold mb-4 text-center">User Found</h2>
            <div className="flex flex-wrap h-32 justify-center items-center gap-2">
              {data?.users_found?.map((item, idx) => (
                <p
                  key={idx}
                  className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-semibold mb-4 text-center">User Not Found</h2>
            <div className="flex flex-wrap h-32 justify-center items-center gap-2">
              {valuesArray.map((item, idx) => (
                <p
                  key={idx}
                  className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MakeUserPurchaseResponse;
