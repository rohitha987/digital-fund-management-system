import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

interface Transaction {
  transactionId: string;
  transactionAmount: number;
  transactionDate: Date;
  transactionType: 'credit' | 'debit';
  groupId: string;
  transactionFrom: string;
  transactionTo: string;
}

@Component({
  selector: 'app-my-transactions',
  imports:[CommonModule],
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.css'],
})
export class MyTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  sortedTransactions: Transaction[] = [];
  userNames: { [key: string]: string } = {};
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired(token)) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
  
    // Manually trigger fetching user
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.authService.fetchUser(userEmail, token).then(() => {
        // Fetch transactions once user is loaded
        this.authService.user$.subscribe((user) => {
          if (user) {
            this.fetchTransactions(user.userId, token);
          } else {
            this.router.navigate(['/login']);
          }
        });
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  

  private async fetchTransactions(userId: string, token: string): Promise<void> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const response = await this.http
        .get<Transaction[]>(`http://localhost:3000/api/transactions/find/user/${userId}`, { headers })
        .toPromise();

      if (!response || response.length === 0) {
        this.error = 'No transactions found.';
        this.isLoading = false;
        return;
      }

      this.transactions = response;
      this.sortedTransactions = [...response];
      await this.fetchUserNames(response, token);
      this.isLoading = false;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      this.error = 'Failed to fetch transactions.';
      this.isLoading = false;
    }
  }

  private async fetchUserNames(transactions: Transaction[], token: string): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const userIds = Array.from(
      new Set(
        transactions.flatMap((transaction) => [
          transaction.transactionFrom,
          transaction.transactionTo,
        ])
      )
    );

    for (const userId of userIds) {
      try {
        const response = await this.http
          .get<{ userName: string }>(`http://localhost:3000/api/users/${userId}`, { headers })
          .toPromise();
        this.userNames[userId] = response?.userName || userId;
      } catch (err) {
        console.error(`Error fetching user name for ID ${userId}:`, err);
      }
    }
  }

  handleSort(criteria: string): void {
    const sorted = [...this.transactions];
    if (criteria === 'date') {
      sorted.sort(
        (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      );
    } else if (criteria === 'group') {
      sorted.sort((a, b) => a.groupId.localeCompare(b.groupId));
    } else if (criteria === 'type') {
      sorted.sort((a, b) => a.transactionType.localeCompare(b.transactionType));
    }
    this.sortedTransactions = sorted;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB'); // Format as dd-mm-yyyy
  }
}
