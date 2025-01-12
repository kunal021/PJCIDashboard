/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { API_URL } from "@/url";
import Loader from "@/utils/Loader";
import axios from "axios";
import { useState } from "react";

function StatusDetail({ status, txn_id, userid, purchase_id, purchase_type }) {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const getPayments = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("txn_id", txn_id);
      formData.append("userid", userid);
      formData.append("purchase_id", purchase_id);
      formData.append("purchase_type", purchase_type);

      const response = await axios.post(
        `${API_URL}/admin/payment/checkforupdatetopg.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.data.status == true) {
        setTransaction(response.data.msg[0]);
      } else {
        setTransaction([]);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      setTransaction([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      getPayments();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger>{status}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="flex flex-row justify-between items-center border-b pb-4">
          <SheetTitle className="text-xl font-semibold">
            Transaction Details
          </SheetTitle>
        </SheetHeader>
        {loading ? (
          <Loader />
        ) : (
          <>
            {transaction ? (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Transaction Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Merchant Transaction ID
                        </p>
                        <p className="font-medium">{transaction.txnid}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Transaction Date
                        </p>
                        <p className="font-medium">{transaction.addedon}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment Mode
                        </p>
                        <p className="font-medium">
                          {transaction.payment_source}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Card Category
                        </p>
                        <p className="font-medium">
                          {transaction.cardCategory !== "NA"
                            ? transaction.cardCategory
                            : "Not Applicable"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Amount Paid
                        </p>
                        <p className="font-medium">
                          ₹{parseFloat(transaction.net_amount_debit).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bank Name
                        </p>
                        <p className="font-medium">
                          {transaction.bank_name !== "NA"
                            ? transaction.bank_name
                            : "Not Applicable"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Customer Name
                        </p>
                        <p className="font-medium">{transaction.firstname}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Customer Phone
                        </p>
                        <p className="font-medium">{transaction.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Customer Email
                        </p>
                        <p className="font-medium">{transaction.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Product Info
                        </p>
                        <p className="font-medium">{transaction.productinfo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Cash Back Percentage
                        </p>
                        <p className="font-medium">
                          {transaction.cash_back_percentage}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Deduction Percentage
                        </p>
                        <p className="font-medium">
                          {transaction.deduction_percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-2xl font-bold">
                No Data Found
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default StatusDetail;
