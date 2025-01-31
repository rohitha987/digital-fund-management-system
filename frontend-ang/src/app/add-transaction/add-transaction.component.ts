import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-transaction',
  imports:[CommonModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent implements OnInit {
  amount: number = 0;
  error: string | null = null;
  organizerId: string | null = null;
  ticketValue: number = 0;
  monthName: string = '';
  groupId: string | null = null;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.ticketValue = state.ticketValue;
    this.monthName = state.monthName;
    this.amount = this.ticketValue;

    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.userId = this.route.snapshot.paramMap.get('userId');

    if (!this.groupId) {
      this.error = 'Group ID is missing.';
      return;
    }

    this.fetchOrganizer();
  }

  fetchOrganizer(): void {
    this.http
      .get<{ organizerId: string }>(
        `http://localhost:3003/api/groups/getOrganizer/${this.groupId}`
      )
      .subscribe(
        (response) => {
          this.organizerId = response.organizerId;
        },
        (error) => {
          console.error('Failed to fetch organizer ID:', error);
          this.error = 'Failed to fetch organizer ID.';
        }
      );
  }

  handleSubmit(): void {
    if (!this.organizerId) {
      this.error = 'Organizer not found. Please try again later.';
      return;
    }

    const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const authToken = this.authService.getToken();

    if (!authToken) {
      this.error = 'Authentication token is missing.';
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const transaction = {
      transactionId,
      userId: this.userId,
      groupId: this.groupId,
      transactionAmount: this.amount,
      transactionType: 'debit',
      transactionDate: new Date().toISOString(),
      transactionFrom: this.userId,
      transactionTo: this.organizerId,
    };

    this.http.post(`http://localhost:3000/api/transactions`, transaction, { headers }).subscribe(
      () => {
        this.router.navigate([`/groups/${this.groupId}`]);
      },
      (error) => {
        console.error('Error adding transaction:', error);
        this.error = 'Failed to add transaction. Please try again.';
      }
    );
  }
}
