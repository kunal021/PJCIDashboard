/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  CreditCard,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Activity,
  Package,
  BadgeCheck,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/url";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useHeading } from "@/hooks/use-heading";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const fetchData = async (id, type, setData, setLoading) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("mo_number", id);
    formData.append("type", type);
    const response = await axios.post(
      `${API_URL}/admin/user/getuserdetailsbytype.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    if (response.status === 200) {
      setData(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

function UserInfo() {
  const { setHeading } = useHeading();
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          User Details
        </h1>
      </div>
    );
  }, [setHeading]);

  useEffect(() => {
    fetchData(id, "1", setUser, setLoading);
    fetchData(id, "2", setTransactions, setLoading);
    fetchData(id, "3", setPurchases, setLoading);
  }, [id]);

  const getInitials = (firstName, lastName) => {
    return firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`
      : "U";
  };

  const userStatusBadge = (isActive) => {
    return isActive === "1" ? (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        <BadgeCheck className="w-3.5 h-3.5 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200"
      >
        <AlertCircle className="w-3.5 h-3.5 mr-1" />
        Inactive
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const userData = user[0] || {};

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* User Profile Section */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-md">
              <AvatarFallback className="text-2xl sm:text-3xl bg-blue-500 text-white">
                {getInitials(userData.firstname, userData.lastname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {userData.firstname} {userData.lastname}
                </h2>
                {userData.isactive && userStatusBadge(userData.isactive)}
              </div>
              <p className="text-gray-600 mb-4">
                User ID: {userData.id || "N/A"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{userData.email || "No email provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>{userData.mo_number || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <span>
                    Registered: {formatDate(userData.registration_date)}
                  </span>
                </div>
                {(userData.area || userData.city || userData.state) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="flex-1">
                      {[
                        userData.area,
                        userData.landmark,
                        userData.city,
                        userData.state,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">User Activity</h2>
        </div>

        <Card>
          <Tabs
            defaultValue="transactions"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <CardHeader className="pb-0">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger
                  value="transactions"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Transactions
                  {transactions.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-indigo-100 text-indigo-800"
                    >
                      {transactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="purchases"
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Purchases
                  {purchases.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-indigo-100 text-indigo-800"
                    >
                      {purchases.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="transactions">
                {loading.transactions ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading transactions...
                  </div>
                ) : transactions.length > 0 ? (
                  <TransactionsCardView
                    transactions={transactions}
                    formatDateTime={formatDateTime}
                  />
                ) : (
                  <EmptyState
                    icon={<CreditCard className="w-12 h-12 text-gray-300" />}
                    title="No Transactions"
                    description="This user has not made any transactions yet."
                  />
                )}
              </TabsContent>
              <TabsContent value="purchases">
                {loading.purchases ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading purchases...
                  </div>
                ) : purchases.length > 0 ? (
                  <PurchasesCardView
                    purchases={purchases}
                    formatDate={formatDate}
                  />
                ) : (
                  <EmptyState
                    icon={<Package className="w-12 h-12 text-gray-300" />}
                    title="No Purchases"
                    description="This user has not made any purchases yet."
                  />
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-50 rounded-full p-6 mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm">{description}</p>
    </div>
  );
}

function TransactionsCardView({ transactions, formatDateTime }) {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedTransactions.map((transaction) => (
        <Card
          key={transaction.id}
          className="hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200"
        >
          <div
            className={`h-2 ${
              transaction.status === "success"
                ? "bg-green-500"
                : transaction.status === "userCancelled"
                ? "bg-red-500"
                : "bg-amber-500"
            }`}
          />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Transaction {transaction.id}
              </CardTitle>
              <Badge
                variant="outline"
                className={
                  transaction.status === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : transaction.status === "userCancelled"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }
              >
                {transaction.status === "userCancelled"
                  ? "Cancelled"
                  : transaction.status}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              {formatDateTime(transaction.payment_date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span
                  className="font-medium text-gray-800 max-w-[180px] truncate"
                  title={transaction.txnid}
                >
                  {transaction.txnid}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Amount</span>
                <span className="text-lg font-semibold">
                  ₹{transaction.amount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PurchasesCardView({ purchases, formatDate }) {
  // Sort purchases by date (newest first)
  const sortedPurchases = [...purchases].sort(
    (a, b) => new Date(b.purchase_date) - new Date(a.purchase_date)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedPurchases.map((purchase) => {
        const isExpired = new Date(purchase.expiry_date) < new Date();

        return (
          <Card
            key={purchase.id}
            className="hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200"
          >
            <div
              className={`h-2 ${isExpired ? "bg-gray-400" : "bg-blue-500"}`}
            />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle
                  className="text-lg font-medium line-clamp-1"
                  title={purchase.purchase_name}
                >
                  {purchase.purchase_name}
                </CardTitle>
                {isExpired ? (
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-600 border-gray-200"
                  >
                    Expired
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Active
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1">
                {purchase.student_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Purchase Date</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(purchase.purchase_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Expiry Date</span>
                  <span
                    className={`font-medium ${
                      isExpired ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    {formatDate(purchase.expiry_date)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span
                    className="font-medium text-gray-800 max-w-[180px] truncate"
                    title={purchase.txnid}
                  >
                    {purchase.txnid}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default UserInfo;
