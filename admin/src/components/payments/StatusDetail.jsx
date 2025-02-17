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
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

function StatusDetail({
  status,
  txn_id,
  userid,
  purchase_id,
  purchase_type,
  refetch,
}) {
  const [transaction, setTransaction] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const getPayments = useCallback(async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("txnid", txn_id);
      formData.append("user_id", userid);
      formData.append("purchase_id", purchase_id);
      formData.append("purchase_type", purchase_type);

      const response = await axios.post(
        `${API_URL}/admin/payment/updatepaymentstatus.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.data.status === 200) {
        setTransaction(response.data.data);
        // Call refetch after successful API call
        // await refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      toast.error(error?.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [txn_id, userid, purchase_id, purchase_type]);

  const handleOpenChange = useCallback(
    (open) => {
      setIsOpen(open);
      if (open) {
        getPayments();
      } else {
        refetch();
      }
    },
    [getPayments, refetch]
  );

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
                        <p className="text-sm text-muted-foreground">Mode</p>
                        <p className="font-medium">{transaction.mode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Error Status
                        </p>
                        <p className="font-medium">{transaction.error}</p>
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
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bank Reference Number
                        </p>
                        <p className="font-medium">
                          {transaction.bank_ref_num}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Easepay ID
                        </p>
                        <p className="font-medium">{transaction.easepayid}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Card Type
                        </p>
                        <p className="font-medium">{transaction.card_type}</p>
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
                      <div>
                        <p className="text-sm text-muted-foreground">UPI ID</p>
                        <p className="font-medium">
                          {transaction.upi_va || "Not Applicable"}
                        </p>
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
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Merchant Key
                        </p>
                        <p className="font-medium">{transaction.key}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="pt-6 border-t">
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
                      <div>
                        <p className="text-sm text-muted-foreground">PG Type</p>
                        <p className="font-medium">
                          {transaction.PG_TYPE !== "NA"
                            ? transaction.PG_TYPE
                            : "Not Applicable"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bank Code
                        </p>
                        <p className="font-medium">
                          {transaction.bankcode !== "NA"
                            ? transaction.bankcode
                            : "Not Applicable"}
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
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Name on Card
                        </p>
                        <p className="font-medium">
                          {transaction.name_on_card !== "NA"
                            ? transaction.name_on_card
                            : "Not Applicable"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Card Number
                        </p>
                        <p className="font-medium">
                          {transaction.cardnum !== "NA"
                            ? transaction.cardnum
                            : "Not Applicable"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
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
