/* eslint-disable react/prop-types */
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { API_URL } from "../../url";
import axios from "axios";
import toast from "react-hot-toast";

function GrantPermission({ userId, defaultPermissions }) {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: prev[key] === "1" ? "0" : "1",
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userId);
      for (const key in permissions) {
        formData.append(key, permissions[key]);
      }
      const response = await axios.post(
        `${API_URL}/admin/user/grantpermissions.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Permissions updated successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="w-full">
        <Button variant="outline">Manage Permissions</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] p-6 z-[200] overflow-y-auto">
        <div className="flex flex-col gap-3">
          {Object.keys(permissions).map((key) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key.replace("_", " ")}</span>
              <Switch
                checked={permissions[key] === "1"}
                onCheckedChange={() => handleToggle(key)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          ))}
        </div>
        <Button
          onClick={handleSavePermissions}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Permissions"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export default GrantPermission;
