import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-groups',
  imports:[CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-groups.component.html', // Link to the HTML file
  styleUrls: ['./my-groups.component.css'], // Link to the CSS file
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = [];
  error: string | null = null;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userRole = user.userRole;
        if (user.groupIds.length > 0) {
          this.fetchGroups(user.userEmail, user.groupIds);
        } else {
          this.error = 'No groups found.';
        }
      }
    });
  }

  private fetchGroups(userEmail: string, groupIds: string[]): void {
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Authentication token is missing.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any[]>(`http://localhost:3000/api/users/groups/${userEmail}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Fetched groups:', response);
          this.groups = response.filter((group) => groupIds.includes(group.groupId));
        },
        error: (err) => {
          console.error('Error fetching groups:', err);
          this.error = 'Failed to fetch groups.';
        },
      });
  }

  handleViewDetails(groupId: string): void {
    this.router.navigate([`/groups/${groupId}`]);
  }

  handleCreateGroup(): void {
    this.router.navigate(['/create-group']);
  }
}
