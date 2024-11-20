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
    const response = await axios.get(`${API_URL}/admin/user/searchuser.php`);
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
                  <TableHeader>
                    <TableRow className="divide-x divide-gray-200">
                      <TableHead className="w-[50px]">Id</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile No.</TableHead>
                      <TableHead>Email</TableHead>
                      {/* <TableHead>Status</TableHead>
                      <TableHead>Update</TableHead> */}
                      {/* <TableHead>More</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200">
                    {data.map((user, idx) => (
                      <TableRow
                        key={user.id}
                        className="divide-x divide-gray-200"
                      >
                        <TableCell>
                          {(currentPage - 1) * 10 + (idx + 1)}
                        </TableCell>
                        <TableCell>
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell>{user.mo_number}</TableCell>
                        <TableCell>{user.email}</TableCell>
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
