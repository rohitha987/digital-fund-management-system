// src/app/view-user-transactions/view-user-transactions.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Transaction {
  transactionId: string;
  transactionAmount: number;
  transactionDate: string;
  transactionType: string;
  userId: string;
}

@Component({
  selector: 'app-view-user-transactions',
  imports:[CommonModule],
  templateUrl: './view-user-transactions.component.html',
  styleUrls: ['./view-user-transactions.component.css'],
})
export class ViewUserTransactionsComponent implements OnInit {
  groupId: string | null = null;
  userId: string | null = null;
  transactions: Transaction[] = [];
  error: string | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.userId = this.route.snapshot.paramMap.get('userId');

    if (this.groupId && this.userId) {
      this.fetchTransactions();
    }
  }

  fetchTransactions(): void {
    const authToken = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http
      .get<Transaction[]>(`http://localhost:3000/api/transactions/find/group/${this.groupId}`, { headers })
      .subscribe({
        next: (data) => {
          this.transactions = data.filter((transaction) => transaction.userId === this.userId);
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
          this.error = 'Failed to fetch transactions.';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' uses dd-mm-yyyy format
  }
}
