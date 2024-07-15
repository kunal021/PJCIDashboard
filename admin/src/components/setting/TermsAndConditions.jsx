import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";

import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";

function TermsAndConditions() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("page_key", "terms_and_conditions");
        const response = await axios.post(
          `${API_URL}/admin/settings/get_page.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        // console.log(response);
        setData(response.data.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("page_key", "terms_and_conditions");
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
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-[80%] flex flex-col justify-center items-center">
          <div className="w-full my-2">
            <Tiptap getHtmlData={getData} initialContent={data} />
          </div>
          <button
            onClick={handlleUpdate}
            className="bg-blue-50 hover:bg-blue-100 text-black border-blue-200 border w-[20%] font-bold py-2 px-4 rounded-md"
          >
            Update
          </button>
        </div>
      )}
    </LayoutAdjuster>
  );
}
export default TermsAndConditions;
