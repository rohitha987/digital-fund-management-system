import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For form handling
import { AuthService } from '../../auth/auth.service';

// Define the shape of the form data
interface FormData {
  userEmail: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importing necessary modules for forms and common directives
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Use the FormData interface for typing the form data
  formData: FormData = { userEmail: '', password: '' };
  error: string | null = null;
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Handle form input change with strict typing
  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    // We explicitly update the corresponding property
    this.formData[target.name as keyof FormData] = target.value;
  }

  // Handle form submission
  handleSubmit(event: Event) {
    event.preventDefault();

    this.authService.login(this.formData.userEmail, this.formData.password)
      .then(() => {
        // Success case
        this.success = true;
        this.error = null;
        this.router.navigate(['/mygroups']);
        // Hide success message after 1 second and navigate to '/mygroups'
        // setTimeout(() => {
        //   this.success = false;
        //   this.router.navigate(['/mygroups']);
        // }, 1000);
      })
      .catch(() => {
        // Error case
        this.error = 'Login failed. Please check your credentials.';
        this.success = false;
      });
  }
}
