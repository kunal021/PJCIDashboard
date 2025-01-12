/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/url";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useHeading } from "@/hooks/use-heading";

const fetchData = async (id, type, setData) => {
  try {
    const formData = new FormData();
    formData.append("mo_number", id);
    formData.append("type", type);
    const response = await axios.post(
      `${API_URL}/admin/user/getuserdetailsbytype.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    console.log(response);
    if (response.status === 200) {
      setData(response.data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

function UserInfo() {
  const { setHeading } = useHeading();
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">User Info</h1>
      </div>
    );
  }, [setHeading]);

  useEffect(() => {
    fetchData(id, "1", setUser);
    fetchData(id, "2", setTransactions);
    fetchData(id, "3", setPurchases);
  }, [id]);

  console.log(user[0]);

  return (
    <Card className="w-full sm:w-[80%] mx-auto  my-5">
      <CardHeader className="text-center">
        <CardTitle className="flex justify-center items-center gap-3 text-3xl font-bold">
          {user[0]?.firstname} {user[0]?.lastname}
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              user[0]?.isactive === "1"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user[0]?.isactive === "1" ? "Active" : "Inactive"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-start items-center gap-6">
          <InfoItem
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={user[0]?.email}
          />
          <InfoItem
            icon={<Phone className="w-5 h-5" />}
            label="Phone"
            value={user[0]?.mo_number}
          />
          <InfoItem
            icon={<User className="w-5 h-5" />}
            label="User ID"
            value={user[0]?.id}
          />
          <InfoItem
            icon={<Calendar className="w-5 h-5" />}
            label="Registered"
            value={new Date(user[0]?.registration_date).toLocaleDateString()}
          />
          {(user[0]?.area ||
            user[0]?.landmark ||
            user[0]?.city ||
            user[0]?.state) && (
            <InfoItem
              icon={<MapPin className="w-5 h-5" />}
              label="Address"
              value={
                user[0]?.area +
                " " +
                user[0]?.landmark +
                " " +
                user[0]?.city +
                " " +
                user[0]?.state
              }
            />
          )}
        </div>

        <Tabs defaultValue="transactions" className="w-full mt-10">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            {transactions.length > 0 ? (
              <TransactionsCardView transactions={transactions} />
            ) : (
              <p className="text-center text-lg font-semibold">
                No Transactions
              </p>
            )}
          </TabsContent>
          <TabsContent value="purchases">
            {purchases.length > 0 ? (
              <PurchasesCardView purchases={purchases} />
            ) : (
              <p className="text-center text-lg font-semibold">No Purchases</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function TransactionsCardView({ transactions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Transaction {transaction.id}</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {transaction.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <InfoItem
                icon={<CreditCard className="w-4 h-4" />}
                label="Transaction ID"
                value={transaction.txnid}
              />
              <InfoItem
                icon={<DollarSign className="w-4 h-4" />}
                label="Amount"
                value={`₹${transaction.amount}`}
              />
              <InfoItem
                icon={<Clock className="w-4 h-4" />}
                label="Date"
                value={new Date(transaction.payment_date).toLocaleString()}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PurchasesCardView({ purchases }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {purchases.map((purchase) => (
        <Card
          key={purchase.id}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="text-lg">{purchase.purchase_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <InfoItem
                icon={<User className="w-4 h-4" />}
                label="Student"
                value={purchase.student_name}
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4" />}
                label="Purchase Date"
                value={new Date(purchase.purchase_date).toLocaleDateString()}
              />
              <InfoItem
                icon={<Clock className="w-4 h-4" />}
                label="Expiry Date"
                value={new Date(purchase.expiry_date).toLocaleDateString()}
              />
              <InfoItem
                icon={<CreditCard className="w-4 h-4" />}
                label="Transaction ID"
                value={purchase.txnid}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserInfo;
