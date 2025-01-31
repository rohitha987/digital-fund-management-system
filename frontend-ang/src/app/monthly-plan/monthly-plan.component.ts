import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GroupData {
  createdAt: Date;
  totalAmount: number;
  duration: number;
  interest: number;
  organizerId: string;
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

@Component({
  selector: 'app-monthly-plan',
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-plan.component.html',
  styleUrls: ['./monthly-plan.component.css']
})
export class MonthlyPlanComponent implements OnInit {
  groupId: string | null = null;
  results: MonthlyPlanEntry[] = [];
  error: string | null = null;
  groupData: GroupData | null = null;
  loading = true;
  showPayForm = false;
  selectedEntry: MonthlyPlanEntry | null = null;
  showSuccessPopup = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Get the groupId from the URL
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    if (!this.groupId) {
      this.error = "Group ID is not available.";
      this.router.navigate(['/error']); // Navigate to the error page if groupId is not found
    } else {
      this.fetchGroupData();
    }
  }

  private fetchGroupData(): void {
    if (!this.groupId) {
      this.error = "Group ID is not available.";
      this.loading = false;
      return;
    }

    // Fetch group data from the API
    this.http.get<GroupData>(`http://localhost:3000/api/groups/${this.groupId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      })
    }).subscribe({
      next: (data) => {
        this.groupData = data;
        this.fetchMonthlyPlan(); // Fetch monthly plan after group data is fetched
      },
      error: (err) => {
        this.error = "Error fetching group data.";
        console.error(err);
        this.loading = false;
      }
    });
  }

  private fetchMonthlyPlan(): void {
    if (!this.groupData) return;
    const { createdAt, totalAmount, interest, duration, monthlyDraw } = this.groupData;

    // Fetch the monthly plan from the server
    this.http.post<any>(`http://localhost:3003/api/groups/${this.groupId}/plan`, {
      createdAt, totalAmount, interest, duration
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      })
    }).subscribe({
      next: (response) => {
        // Fetch transactions related to the group
        this.http.get<any>(`http://localhost:3000/api/transactions/find/group/${this.groupId}`, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          })
        }).subscribe({
          next: (transactionResponse) => {
            const transactions = transactionResponse.data;
            const monthlyResults = response.results.map((entry: any, index: number) => {
              const isPaid = transactions.some((transaction: any) => {
                return transaction.transactionAmount === parseFloat(entry.amount) &&
                  transaction.transactionDate.includes(entry.month) &&
                  transaction.transactionType === "debit";
              });

              return {
                ...entry,
                userName: monthlyDraw[index] || "N/A",
                status: isPaid ? "Paid" : "Unpaid"
              };
            });

            this.results = monthlyResults;
          },
          error: (err) => {
            this.error = "Error fetching transactions.";
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = "Error fetching monthly plan data.";
        console.error(err);
        this.loading = false;
      }
    });
  }

  generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  handlePayClick(entry: MonthlyPlanEntry): void {
    this.selectedEntry = entry;
    this.showPayForm = true;
  }

  handleSubmitPayment(): void {
    if (!this.selectedEntry) return; // Exit if selectedEntry is null

    const transactionId = this.generateTransactionId();
    const amount = parseFloat(this.selectedEntry!.amount);

    if (isNaN(amount)) {
      this.error = "Invalid amount.";
      return; // Exit if the amount is invalid
    }

    // Fetch user data based on the selected entry's username
    this.http.get<any>(`http://localhost:3002/api/users/name/${this.selectedEntry.userName}`).subscribe({
      next: (response) => {
        this.http.post('http://localhost:3000/api/transactions', {
          transactionId,
          userId: this.groupData?.organizerId,
          groupId: this.groupId,
          transactionAmount: amount,  // Use the parsed amount (number)
          transactionType: "debit",
          transactionDate: new Date().toISOString(),
          transactionFrom: this.groupData?.organizerId,
          transactionTo: response.data
        }, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          })
        }).subscribe({
          next: () => {
            // Update the status of the entry to "Paid"
            this.results = this.results.map((entry) =>
              entry.month === this.selectedEntry?.month ? { ...entry, status: "Paid" } : entry
            );
            this.showPayForm = false;
            this.showSuccessPopup = true;
          },
          error: (err) => {
            this.error = "Error processing payment.";
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.error = "Error fetching user data.";
        console.error(err);
      }
    });
  }

  isMonthEven(month: any): boolean {
    // Ensure that month is a number, and check if it's even.
    const monthNumber = Number(month);
    return !isNaN(monthNumber) && monthNumber % 2 === 0;
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
}
