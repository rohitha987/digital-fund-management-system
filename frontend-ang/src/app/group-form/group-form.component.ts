import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-form',
  imports:[CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css'],
})
export class GroupFormComponent implements OnInit {
  formData = {
    groupId: '',
    groupName: '',
    members: '',
    totalAmount: '',
    interest: '',
    organizerId: '',
    groupType: '',
    duration: '',
    ticketValue: '',
    description: 'Join Group',
  };

  user: any;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (this.user?.userRole !== 'organizer') {
        this.error = 'You do not have permission to access this page.';
      }
    });
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      this.error = 'You must be logged in to create a group.';
    }
  }

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
  
    // Ensure name exists in formData and update it
    if (name in this.formData) {
      this.formData[name as keyof typeof this.formData] = value;
    }
  }
  
  

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.user) {
      this.error = 'You must be logged in to create a group.';
      return;
    }

    if (this.formData.members) {
      this.formData.ticketValue = (parseFloat(this.formData.totalAmount) / parseInt(this.formData.members)).toFixed(2);
    } else {
      this.formData.ticketValue = '0.00';
    }

    this.formData.organizerId = this.user.userId;
    this.formData.duration = this.formData.members;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    this.http
      .post('http://localhost:3000/api/groups', this.formData, { headers })
      .subscribe(
        (response: any) => {
          this.http
            .patch(`http://localhost:3000/api/users/addGroup/${this.user.userEmail}`, {
              groupId: this.formData.groupId,
            }, { headers })
            .subscribe((userResponse: any) => {
              this.authService.userSubject.next(userResponse.data);
              this.router.navigate(['/mygroups'], { queryParams: { refresh: 'true' } });
            });
        },
        (error) => {
          console.error('Error creating group:', error);
        }
      );
  }

  formatTicketValue(): string {
    return this.formData.members ? (parseFloat(this.formData.totalAmount) / parseInt(this.formData.members)).toFixed(2) : '0.00';
  }

}
