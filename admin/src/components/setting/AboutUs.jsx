import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import Loader from "../../utils/Loader";
import { useHeading } from "@/hooks/use-heading";

function AboutUs() {
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">About Us</h1>
      </div>
    );

    const fetchData = async () => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("page_key", "about_us");
        const response = await axios.post(
          `${API_URL}/admin/settings/get_page.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        setData(response.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setHeading]);

  const handlleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("page_key", "about_us");
      formData.append("page_content", data);
      await axios.post(`${API_URL}/admin/settings/updatepage.php`, formData, {
        headers: { "content-type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getData = (html) => {
    setData(html);
  };
  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="w-full my-2">
            <Tiptap getHtmlData={getData} initialContent={data} />
          </div>
          <button
            onClick={handlleUpdate}
            className="bg-blue-50 hover:bg-blue-100 border-blue-200 border text-black font-bold py-2 px-4 rounded-md w-full"
          >
            Update
          </button>
        </div>
      )}
    </>
  );
}

export default AboutUs;
