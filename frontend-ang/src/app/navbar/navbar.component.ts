import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      // Add a delay before updating the isAuthenticated state
      // setTimeout(() => {
      //   this.isAuthenticated = !!user;
      // }, 1000); 
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home page after logout
  }
}
