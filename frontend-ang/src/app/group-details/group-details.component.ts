// group-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Participant {
  userId: string;
  userName: string;
}

interface Group {
  groupId: string;
  groupName: string;
  groupType: string;
  interest: number;
  organizerId: string;
  members: number;
  duration: number;
  totalAmount: number;
  ticketValue: number;
  participants: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Transaction {
  transactionId: string;
  transactionAmount: number;
  transactionDate: string;
  transactionType: string;
  userId: string;
}

@Component({
  selector: 'app-group-details',
  imports:[CommonModule, FormsModule],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  groupId: string | null = null;
  group: Group | null = null;
  participants: Participant[] = [];
  transactions: Transaction[] = [];
  error: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user?.userRole === 'participant') {
        // handle logic for participant role
      }
    });
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    if (this.groupId) {
      this.fetchGroupDetails();
    }
  }
  

  fetchGroupDetails(): void {
    this.loading = true;
    this.http
      .get<Group>(`http://localhost:3000/api/groups/${this.groupId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .subscribe({
        next: (data) => {
          this.group = data;
          this.fetchParticipants(data.participants);
        },
        error: (err) => {
          console.error('Error fetching group details:', err);
          this.error = 'Failed to fetch group details.';
        },
        complete: () => (this.loading = false),
      });
  }

  fetchParticipants(participantIds: string[]): void {
    Promise.all(
      participantIds.map((userId) =>
        this.http
          .get<Participant>(`http://localhost:3000/api/users/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          })
          .toPromise()
      )
    )
      .then((data) => {
        this.participants = data as Participant[];
      })
      .catch((err) => {
        console.error('Error fetching participants:', err);
        this.error = 'Failed to fetch participants.';
      });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(date));
  }

  getEndDate(startDate: Date, duration: number): string {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration - 1);
    return this.formatDate(endDate);
  }

  handleViewTransactions(userId: string): void {
    this.router.navigate([`/transactions/${this.groupId}/${userId}`]);
  }

  handleViewAllGroupTransactions(): void {
    this.router.navigate([`/groups/${this.groupId}/transactions`]);
  }

  handleViewPlan(): void {
    if (!this.group) return;

    const { totalAmount, duration, members, interest } = this.group;
    this.http
      .post<any>(
        'http://localhost:3000/api/groups/calculateChit',
        {
          totalAmount,
          months: duration,
          members,
          commission: interest,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      )
      .subscribe({
        next: (response) => {
          this.router.navigate(['/plan-month'], {
            state: { groupId: this.groupId, results: response.results, totalProfit: response.totalProfit },
          });
        },
        error: (err) => {
          console.error('Error fetching group plan:', err);
          this.error = 'Failed to fetch group plan.';
        },
      });
  }
}
