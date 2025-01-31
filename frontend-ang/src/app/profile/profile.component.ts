import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports:[CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserEmail) {
      this.fetchUserDetails(storedUserEmail);
    } else {
      this.error = 'No user email found in localStorage.';
    }
  }

  fetchUserDetails(email: string): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    });

    this.http.get(`http://localhost:3000/api/users/email/${email}`, { headers })
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
          this.error = 'Failed to fetch user details.';
        }
      });
  }

  handleEditProfile(): void {
    console.log('Navigating to Edit Profile...');
    // Implement navigation logic here
  }
}
