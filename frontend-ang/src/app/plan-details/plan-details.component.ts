import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-details',
  imports:[CommonModule],
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.css'],
})
export class PlanDetailsComponent implements OnInit {
  results: any[] = [];
  totalProfit: number = 0; // Initialize with a default value
  groupId: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

    if (state && state.results && state.totalProfit !== undefined && state.groupId) {
      this.results = state.results;
      this.totalProfit = state.totalProfit || 0; // Default to 0 if null
      this.groupId = state.groupId;
    } else {
      console.error('No state received.');
      this.router.navigate(['/chitplans']); // Redirect if no state is received
    }
  }

  handleJoinGroup(): void {
    if (!this.groupId) {
      console.error('Group ID is missing.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing.');
      return;
    }

    fetch('http://localhost:3000/api/groups/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        groupId: this.groupId,
        userId: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to join group');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Successfully joined group:', data);
        alert('Request Sent Successfully');
      })
      .catch((error) => {
        console.error('Error joining group:', error);
      });
  }
}
