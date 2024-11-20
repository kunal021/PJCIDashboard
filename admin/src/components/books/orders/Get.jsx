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
import Pagination from "@/utils/Pagination";
import Loader from "@/utils/Loader";
import FormField from "@/utils/FormField";

const getOrders = async (setData, setPaginationData, setLoading, filters) => {
  try {
    setLoading(true);
    const params = {
      status: filters.status || undefined,
      user_id: filters.user_id || undefined,
      txn_id: filters.txn_id || undefined,
      from_date: filters.from_date || undefined,
      to_date: filters.to_date || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
    const response = await axios.get(
      `${API_URL}/admin/book/getbookorders.php`,
      {
        params,
      }
    );
    console.log(response);
    if (response.data.data.length > 0) {
      setData(response.data.data);
      setPaginationData(response.data.pagination);
    } else {
      setData([]); // Clear the table if no data is found
      setPaginationData({ total_pages: 0 }); // Reset pagination data
    }
  } catch (error) {
    console.log("Error fetching orders:", error);
    setData([]); // Clear data on error as well
  } finally {
    setLoading(false);
  }
};

function BookOrders() {
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    user_id: "",
    txn_id: "",
    from_date: "",
    to_date: "",
    page: 1,
    limit: 10,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    user_id: "",
    txn_id: "",
    from_date: "",
    to_date: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    getOrders(setData, setPaginationData, setLoading, filters);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters({
      ...filters,
      page: 1,
    });
    getOrders(setData, setPaginationData, setLoading, {
      ...filters,
      page: 1,
    });
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: "",
      user_id: "",
      txn_id: "",
      from_date: "",
      to_date: "",
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    getOrders(setData, setPaginationData, setLoading, defaultFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getOrders(setData, setPaginationData, setLoading, {
      ...appliedFilters,
      page,
    });
  };

  const statusClassName = (status) => {
    switch (status) {
      case "pending":
        return "text-orange-500";
      case "completed":
        return "text-green-500";
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
        <div className="w-[80%] max-w-7xl flex flex-col justify-center items-center mx-auto">
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-3xl font-bold text-center my-5">Book Orders</h1>
          </div>

          <div className="w-full flex flex-col justify-between mb-5 gap-4">
            <div className="flex justify-between items-center gap-4">
              <FormField
                htmlFor="user_id"
                id="user_id"
                type="text"
                placeholder="Mobile No."
                name="user_id"
                value={filters.user_id}
                onChange={handleChange}
              >
                Mobile No.
              </FormField>
              <FormField
                htmlFor="tnx_id"
                id="tnx_id"
                type="text"
                name="txn_id"
                placeholder="Transaction ID"
                value={filters.txn_id}
                onChange={handleChange}
              >
                Transaction ID
              </FormField>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="border p-2 mt-2 rounded"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
              </select>
            </div>
            <div className="flex justify-between items-center gap-4">
              <FormField
                htmlFor="from_date"
                id="from_date"
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleChange}
              >
                From Date
              </FormField>
              <FormField
                htmlFor="to_date"
                id="to_date"
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleChange}
              >
                To Date
              </FormField>

              <button
                onClick={applyFilters}
                className="bg-blue-500 text-white px-4 py-1.5 mt-2 rounded w-full"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-red-500 text-white px-4 py-1.5 mt-2 rounded w-full"
              >
                Clear Filters
              </button>
            </div>
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
                  setCurrPage={handlePageChange}
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
