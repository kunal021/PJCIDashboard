import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import { CalendarClock, IndianRupee, SquarePlay } from "lucide-react";
import { LatexParser } from "@/utils/LatexParser";
import MakeUserPurchase from "../setting/MakeUserPurchase";
import expiryDate from "@/utils/ExpiryDate";
import MakeUserPurchaseResponse from "@/utils/MakeUserPurchaseResponse";
import { useHeading } from "@/hooks/use-heading";

const fetchCourse = async (setCourses, setLoading, id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_type", 1);
    formData.append("course_id", id);
    const response = await axios.post(
      `${API_URL}/admin/courses/getcoursebyid.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );

    if (response.status === 200) {
      setCourses(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

// eslint-disable-next-line react/prop-types
function GetCourseById({ id }) {
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [makePurchaseData, setMakePurchaseData] = useState(null);
  const [makePurchaseStatus, setMakePurchaseStatus] = useState(false);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className=" text-xl sm:text-3xl font-bold text-center">
          Course Detail
        </h1>
      </div>
    );
    fetchCourse(setCourses, setLoading, id);
  }, [id, setHeading]);

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
    }
    return data;
  };

  return (
    <div className="w-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col items-center">
          {courses ? (
            <div className="w-full max-w-6xl">
              {makePurchaseStatus && (
                <MakeUserPurchaseResponse
                  data={makePurchaseData}
                  onClose={() => setMakePurchaseStatus(false)}
                />
              )}
              <div className="flex flex-col w-full border rounded-md border-zinc-300 p-3 sm:p-4 md:p-6 mt-2 mb-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <div className="w-full sm:w-48 h-48 sm:h-32 md:h-36">
                    <img
                      src={courses.img_url}
                      alt="course"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between gap-2">
                      <h2 className="text-lg md:text-xl font-medium">
                        {renderCourseData(courses.course_name)}
                      </h2>
                      <div className="w-fit">
                        {courses && (
                          <MakeUserPurchase
                            id={courses.id}
                            amount={courses.price}
                            expiryDate={expiryDate(courses?.course_duration, 7)}
                            productInfo={courses.course_name}
                            type="1"
                            setMakePurchaseStatus={setMakePurchaseStatus}
                            setMakePurchaseData={setMakePurchaseData}
                          />
                        )}
                      </div>
                    </div>

                    <hr className="w-full border-slate-300" />

                    <div className="grid grid-cols-3 gap-2 text-sm md:text-base">
                      <div className="flex items-center gap-1">
                        <CalendarClock className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm">
                          {courses.course_duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SquarePlay className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm">
                          {courses.total_number_of_videos}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm">
                          {courses.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="w-full border-slate-300 my-4" />

                <div className="text-sm md:text-base whitespace-pre-wrap">
                  {renderCourseData(courses.course_description)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xl md:text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetCourseById;
