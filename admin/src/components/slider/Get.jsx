import { useEffect, useState } from "react";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../../url";
import { Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteSlider, setSlider } from "../../redux/slider/sliderSlice";
import ConfirmDelete from "../../utils/ConfirmDelete";
import Add from "./Add";
import Update from "./Update";
import { useHeading } from "@/hooks/use-heading";

function Get() {
  const { setHeading } = useHeading();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState([]);
  const slider = useSelector((state) => state.slider.slider);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          App Slider
        </h1>
        <Add />
      </div>
    );
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_URL}/admin/slider/getslider.php`
        );

        if (response.status === 200) {
          dispatch(setSlider(response.data.data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, setHeading]);

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/slider/deleteslider.php`,
        formData
      );
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

        const updatedSlider = slider.map((slider) =>
          slider.id === sliderId ? { ...slider, is_active } : slider
        );
        dispatch(setSlider(updatedSlider));
      } catch (error) {
        console.log("Error updating user status:", error);
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="w-full flex flex-col justify-center items-center">
            {slider.length > 0 ? (
              <div className="flex flex-col gap-5 justify-center items-center w-full">
                {slider.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center items-center font-medium w-fit border rounded-md border-zinc-300 my-5 p-1.5 gap-2"
                  >
                    <div className="flex justify-between items-center w-full">
                      <Avatar className="scale-[85%] text-lg">{idx + 1}</Avatar>
                      {renderTitle(item.type)}
                      <div className="w-[20%] flex flex-col justify-center items-center">
                        <p className="text-xs font-bold">
                          {item.is_active === "1" ? "Public" : "Private"}
                        </p>
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
                      </div>
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
    </>
  );
}

export default Get;
