/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Mail, Phone, User } from "lucide-react";

function UserInfo() {
  const location = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (location?.state !== null && location?.state?.data !== null) {
      setUser(location.state.data);
    }
  }, [location]);
  console.log(user);
  return (
    <Card className="w-full sm:w-[80%] mx-auto  my-5">
      <CardHeader className="text-center">
        <CardTitle className="flex justify-center items-center gap-3 text-3xl font-bold">
          {user.firstname} {user.lastname}
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              user.isactive === "1"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isactive === "1" ? "Active" : "Inactive"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={user.email}
          />
          <InfoItem
            icon={<Phone className="w-5 h-5" />}
            label="Phone"
            value={user.mo_number}
          />
          <InfoItem
            icon={<User className="w-5 h-5" />}
            label="User ID"
            value={user.id}
          />
          <InfoItem
            icon={<Calendar className="w-5 h-5" />}
            label="Registered"
            value={new Date(user.registration_date).toLocaleDateString()}
          />
        </div>
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

export default UserInfo;
