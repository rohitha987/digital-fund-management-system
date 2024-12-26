import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const generateTransactionId = () => {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

interface GroupData {
  createdAt: Date;
  totalAmount: number;
  duration: number;
  interest: number;
  organizerId:string;
  monthlyDraw: string[];
}

interface MonthlyPlanEntry {
  month: string;
  amount: string;
  commission: string;
  amountGiven: string;
  userName: string;
  status: "Paid" | "Unpaid";
}

const MonthlyPlan: React.FC = () => {
  const location = useLocation();
  const groupId = location.state?.groupId;
  const [results, setResults] = useState<MonthlyPlanEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPayForm, setShowPayForm] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<MonthlyPlanEntry | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        setError("Group ID is not available.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setGroupData(response.data);
      } catch (err) {
        setError("Error fetching group data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    const fetchMonthlyPlan = async () => {
      if (!groupData) return;
      const { createdAt, totalAmount, interest, duration, monthlyDraw } = groupData;

      try {
        const response = await axios.post(
          `http://localhost:3003/api/groups/${groupId}/plan`,
          { createdAt, totalAmount, interest, duration },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const monthlyResults = response.data.results.map((entry: any, index: number) => ({
          ...entry,
          userName: monthlyDraw[index] || "N/A",
          status: entry.status || "Unpaid", // Default to "Unpaid" if status is missing
        }));

        setResults(monthlyResults);
      } catch (err) {
        setError("Error fetching monthly plan data.");
        console.error(err);
      }
    };

    fetchMonthlyPlan();
  }, [groupData, groupId]);

  const handlePayClick = (entry: MonthlyPlanEntry) => {
    setSelectedEntry(entry);
    setShowPayForm(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedEntry) return;

    const transactionId = generateTransactionId();
    try {
      const response = await axios.get(`http://localhost:3002/api/users/name/${selectedEntry.userName}`);
      console.log(response);
      await axios.post(
        `http://localhost:3000/api/transactions`,
        {
            transactionId,
            userId: groupData?.organizerId,
            groupId,
            transactionAmount: selectedEntry.amount,
            transactionType: 'debit', // Assuming the user is making a payment (debit)
            transactionDate: new Date().toISOString(),
            transactionFrom: groupData?.organizerId, // Sender is the user making the payment
            transactionTo: response.data, // Recipient is the group organizer
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        }
    );

      // Update the entry status to "Paid"
      setResults((prevResults) =>
        prevResults.map((entry) =>
          entry.month === selectedEntry.month ? { ...entry, status: "Paid" } : entry
        )
      );

      setShowPayForm(false);
      setSelectedEntry(null);
    } catch (err) {
      setError("Error processing payment.");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-blue-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Monthly Plan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Month</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Commission</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount Given</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Assigned User</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((entry, index) => (
              <tr key={index} className="even:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700">{entry.month}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{entry.amount}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{entry.commission}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{entry.amountGiven}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{entry.userName}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{entry.status}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {entry.status === "Unpaid" && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handlePayClick(entry)}
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPayForm && selectedEntry && (
        <div className="mt-6 bg-white p-4 shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          <p>
            <strong>Month:</strong> {selectedEntry.month}
          </p>
          <p>
            <strong>User Name:</strong> {selectedEntry.userName}
          </p>
          <p>
            <strong>Amount:</strong> {selectedEntry.amount}
          </p>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSubmitPayment}
          >
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyPlan;
