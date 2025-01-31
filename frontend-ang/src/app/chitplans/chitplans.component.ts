import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-chitplans',
  imports:[CommonModule, FormsModule],
  templateUrl: './chitplans.component.html',
  styleUrls: ['./chitplans.component.css']
})
export class ChitPlansComponent implements OnInit {
  groups: Group[] = [];
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });

    this.http.get<Group[]>('http://localhost:3000/api/groups/all', { headers })
      .subscribe({
        next: (data) => this.groups = data,
        error: (err) => {
          console.error('Error fetching groups:', err);
          this.error = 'Failed to fetch groups.';
        }
      });
  }

  handleCalculateChit(group: Group): void {
    const { groupId, totalAmount, duration, members, interest } = group;
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });
  
    const payload = {
      totalAmount,
      months: duration,
      members,
      commission: interest
    };
  
    this.http.post('http://localhost:3000/api/groups/calculateChit', payload, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Navigation state:', {
            results: response.results,
            totalProfit: response.totalProfit,
            groupId: groupId
          });
          this.router.navigate(['/plan'], {
            state: {
              results: response.results,
              totalProfit: response.totalProfit,
              groupId: groupId
            }
          });
        },
        error: (err) => {
          console.error('Error calculating chit:', err);
          this.error = 'Failed to calculate chit.';
        }
      });
  }
  
}
