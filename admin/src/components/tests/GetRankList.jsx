/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import Loader from "@/utils/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router-dom";
import Pagination from "@/utils/Pagination";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Download } from "lucide-react";

const fetchRankList = async (
  setRank,
  setPaginationData,
  setLoading,
  testId,
  page
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("test_id", testId);
    formData.append("page", page);
    const response = await axios.post(
      `${API_URL}/admin/test/getranklist.php`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log(response);

    if (response.status === 200) {
      setRank(response.data.data);
      setPaginationData(response.data.pagination);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetRankList({ testId }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [rank, setRank] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRankList(setRank, setPaginationData, setLoading, testId, currentPage);
  }, [currentPage, testId]);

  const handleDownload = async () => {
    try {
      const formData = new FormData();
      formData.append("testid", testId);
      const response = await axios.post(
        `${API_URL}/admin/test/gettestreport.php`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        const data = response.data.data;

        if (data && data.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          const columnWidths = [
            { wpx: 120 },
            { wpx: 120 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
          ];

          worksheet["!cols"] = columnWidths;
          XLSX.utils.book_append_sheet(workbook, worksheet, "Test Results");
          XLSX.writeFile(workbook, `test_report_${testId}.xlsx`);
          toast.success("Data exported successfully.");
        } else {
          toast.error("No data available for export.");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error fetching data");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-4 w-full">
            <h1 className="text-xl sm:text-3xl font-bold mb-6">Rank List</h1>
            <Button
              onClick={handleDownload}
              variant="destructive"
              className="text-base font-bold mb-6"
            >
              {isMobile ? <Download /> : "Download Report"}
            </Button>
          </div>
          {rank.length > 0 ? (
            <>
              <div className="w-full relative">
                <div className="w-full absolute">
                  <Table className="border border-gray-200 rounded">
                    <TableHeader>
                      <TableRow className="divide-x divide-gray-200">
                        <TableHead className="w-[50px]  text-center">
                          Id
                        </TableHead>
                        <TableHead className="w-[50px]  text-center">
                          Rank
                        </TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Mark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                      {rank.map((rank, idx) => (
                        <TableRow
                          key={rank.id}
                          className="divide-x divide-gray-200 text-center"
                        >
                          <TableCell>
                            {(currentPage - 1) * 10 + (idx + 1)}
                          </TableCell>
                          <TableCell>{rank.rank}</TableCell>
                          <TableCell>
                            <div
                              onClick={() =>
                                navigate(`/rank/${rank.mo_number}`)
                              }
                              className="cursor-pointer"
                            >
                              {rank.name}
                            </div>
                          </TableCell>
                          <TableCell>{rank.mark}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="my-4 w-full flex justify-center items-center ">
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GetRankList;
