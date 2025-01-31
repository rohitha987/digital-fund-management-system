import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';  // Import DatePipe

interface Transaction {
  transactionId: string;
  transactionAmount: number;
  transactionDate: string;
  transactionType: string;
  transactionFrom: string;
  transactionTo: string;
}

@Component({
  selector: 'app-group-transactions',
  imports:[CommonModule],
  standalone: true,  // Mark the component as standalone
  templateUrl: './group-transactions.component.html',
  styleUrls: ['./group-transactions.component.css'],
  providers: [DatePipe]  // Provide DatePipe locally
})
export class GroupTransactionsComponent implements OnInit {
  groupId: string | null = null;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  userNames: { [key: string]: string } = {};
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe  // Inject DatePipe
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    if (this.groupId) {
      this.fetchTransactions(this.groupId);
    }
  }

  fetchTransactions(groupId: string): void {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`).set('Content-Type', 'application/json');

    this.http.get<Transaction[]>(`http://localhost:3000/api/transactions/find/group/${groupId}`, { headers })
      .subscribe({
        next: (transactionsData) => {
          this.transactions = transactionsData;
          this.filteredTransactions = transactionsData.filter(tx => tx.transactionType === 'debit');
          
          const userIds = [
            ...new Set(
              transactionsData.flatMap(tx => [tx.transactionFrom, tx.transactionTo])
            )
          ];

          this.fetchUserNames(userIds);
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
          this.error = 'Failed to fetch transactions.';
        }
      });
  }

  fetchUserNames(userIds: string[]): void {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`).set('Content-Type', 'application/json');

    userIds.forEach(userId => {
      this.http.get<{ userName: string }>(`http://localhost:3000/api/users/${userId}`, { headers })
        .subscribe({
          next: (userData) => {
            this.userNames[userId] = userData.userName;
          },
          error: (err) => {
            console.error('Error fetching user name:', err);
          }
        });
    });
  }

  getMonthName(month: number): string {
    return new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  }

  // Method to format date using DatePipe
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'shortDate');
  }

  filterDebits(): void {
    this.filteredTransactions = this.transactions.filter(tx => tx.transactionType === 'debit');
  }

  filterByMonth(month: number): void {
    this.filteredTransactions = this.transactions.filter(tx => 
      tx.transactionType === 'debit' &&
      new Date(tx.transactionDate).getMonth() === month - 1
    );
  }

  // Inside GroupTransactionsComponent
onMonthSelect(event: any): void {
  const selectedMonth = parseInt(event.target.value);
  if (selectedMonth) {
    this.filterByMonth(selectedMonth);
  } else {
    this.filterDebits(); // Show all debits if no specific month is selected
  }
}

}
