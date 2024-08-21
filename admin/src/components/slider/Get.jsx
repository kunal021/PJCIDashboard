import { useEffect, useState } from "react";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../../url";
import { Avatar } from "antd";
// import LinkButton from "../../utils/LinkButton";
import { useDispatch, useSelector } from "react-redux";
import { deleteSlider, setSlider } from "../../redux/slider/sliderSlice";
import ConfirmDelete from "../../utils/ConfirmDelete";
import Add from "./Add";
import Update from "./Update";

function Get() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState([]);
  const slider = useSelector((state) => state.slider.slider);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_URL}/public/slider/getslider.php`

          //   { headers: "content-type/form-data" }
        );

        // console.log(response);
        if (response.status === 200) {
          dispatch(setSlider(response.data.data));
        }
      } catch (error) {
        console.log(error);
        // toast.error(error.response.data.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    // console.log(slider);

    fetchData();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/slider/deleteslider.php`,
        formData
      );
      console.log(response);
      if (response.status === 200) {
        dispatch(deleteSlider(id));
        toast.success("Slider deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error deleting slider");
    }
  };

  const handleChangeStatus = async (sliderId, is_active) => {
    const confirmAlert = window.confirm(
      `${
        is_active === "1"
          ? "Slider will become Inactive. Do you want to proceed"
          : "Slider will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("id", sliderId);
        formData.append("status_code", is_active);
        await axios.post(
          `${API_URL}/admin/slider/updatesliderstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        // console.log(res);
        // Update local state instead of fetching users again
        const updatedSlider = slider.map((slider) =>
          slider.id === sliderId ? { ...slider, is_active } : slider
        );
        dispatch(setSlider(updatedSlider));
      } catch (error) {
        console.log("Error updating user status:", error);
        // Handle error (e.g., show an error message)
      }
    }
  };

  const renderTitle = (data) => {
    let title;
    switch (data) {
      case "1":
        title = "Course";
        break;
      case "2":
        title = "Batch";
        break;
      case "3":
        title = "Test";
        break;
      default:
        title = "Slider";
    }
    return <p>For {title}</p>;
  };

  console.log(slider);

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col justify-center items-center mx-auto">
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">App Slider</h1>
            {/* <LinkButton to="/add-course">Add Image</LinkButton> */}
            <Add />
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            {slider.length > 0 ? (
              <div className="flex flex-col gap-5 justify-center items-center w-full">
                {slider.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center items-center font-medium w-fit border rounded-md border-zinc-300 ml-2 my-5 p-1.5 gap-2"
                  >
                    <div className="flex justify-between items-center w-full">
                      <Avatar className="scale-[85%] text-lg">{idx + 1}</Avatar>
                      {renderTitle(item.type)}
                      <button
                        onClick={() => {
                          handleChangeStatus(item.id, item.is_active);
                        }}
                        className="toggle-switch scale-[60%] align-middle"
                      >
                        <input
                          type="checkbox"
                          checked={item.is_active === "1"}
                          readOnly
                        />
                        <div className="toggle-switch-background">
                          <div className="toggle-switch-handle"></div>
                        </div>
                      </button>
                      <ConfirmDelete
                        handleClick={() => handleDelete(item.id)}
                      />
                      <Update item={item} />
                    </div>
                    <img
                      src={item.img_url}
                      className="h-[300px] w-[550px] rounded-md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl font-bold text-center mt-20">
                No Data Available
              </div>
            )}
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default Get;
