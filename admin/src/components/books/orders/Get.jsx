import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_URL } from "@/url";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import { Loader } from "lucide-react";
import Pagination from "@/utils/Pagination";

const getOrders = async (setData, setPaginationData, page, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/admin/book/getbookorders.php`);
    // console.log(response);
    setData(response.data.data);
    setPaginationData(response.data.pagination);
  } catch (error) {
    console.log("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};

function BookOrders() {
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    getOrders(setData, setPaginationData, currentPage, setLoading);
  }, [currentPage, setData]);

  const statusClassName = (status) => {
    switch (status) {
      case "pending":
        return "text-orange-500";
      case "completed":
        return "text-green-500";
      //   case "cancelled":
      //     return "text-red-500";
      case "processing":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${"w-[80%] max-w-7xl flex flex-col justify-center items-center mx-auto"}`}
        >
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-3xl font-bold text-center my-5">Book Orders</h1>
          </div>
          {data.length > 0 ? (
            <>
              <div className="w-full overflow-auto mt-4">
                <Table className="border border-gray-200 rounded">
                  <TableHeader className="bg-gray-100">
                    <TableRow className="divide-x divide-gray-200">
                      <TableHead className="w-[50px] text-center">Id</TableHead>
                      <TableHead className="text-center">Name</TableHead>
                      <TableHead className="text-center">Mobile No.</TableHead>
                      <TableHead className="text-center">Book Name</TableHead>
                      <TableHead className="text-center">
                        Transition Id
                      </TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {data.map((user, idx) => (
                      <TableRow
                        key={user.id}
                        className="divide-x divide-gray-200 text-center"
                      >
                        <TableCell>
                          {(currentPage - 1) * 10 + (idx + 1)}
                        </TableCell>
                        <TableCell>{user.student_name}</TableCell>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>{user.book_name}</TableCell>
                        <TableCell>{user.txn_id}</TableCell>
                        <TableCell className={statusClassName(user.status)}>
                          {user.status}
                        </TableCell>
                        <TableCell>{user.created_at.slice(0, 10)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="my-4 w-full flex justify-center items-center ">
                <Pagination
                  totalPage={paginationData.total_pages}
                  currPage={currentPage}
                  setCurrPage={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default BookOrders;
