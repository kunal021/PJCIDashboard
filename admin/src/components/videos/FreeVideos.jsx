import LayoutAdjuster from "../../utils/LayoutAdjuster";
import LinkButton from "../../utils/LinkButton";
import Loader from "../../utils/Loader";

function FreeVideos() {
  const loading = false;
  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[80%] flex flex-col justify-center items-center mx-auto">
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">Free Video List</h1>
            <LinkButton to="/add-free-video">Add Free Video</LinkButton>
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default FreeVideos;
