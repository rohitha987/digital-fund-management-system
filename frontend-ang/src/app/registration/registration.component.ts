import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  error: string | null = null;
  success: boolean = false;

  // Fields to iterate over for form creation
  formFields = ['userName', 'userEmail', 'password', 'userMobileNum', 'userAddress'];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registrationForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userMobileNum: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      userAddress: ['', Validators.required],
      userRole: ['participant', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.error = 'Please correct the errors in the form.';
      return;
    }

    const formData = this.registrationForm.value;
    this.authService.register(formData).then(() => {
      this.success = true;
      this.error = null;
      this.registrationForm.reset({
        userRole: 'participant',
      });
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }).catch((err) => {
      this.success = false;
      this.error = err.error?.message || 'Registration failed. Please try again.';
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registrationForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  getFieldError(field: string): string {
    const control = this.registrationForm.get(field);
    if (control?.hasError('required')) {
      return `${this.formatLabel(field)} is required.`;
    }
    if (control?.hasError('email')) {
      return 'Email is invalid.';
    }
    if (control?.hasError('minlength')) {
      return 'Password should be at least 6 characters.';
    }
    if (control?.hasError('pattern')) {
      return 'Mobile number must be a 10-digit number.';
    }
    return '';
  }

  formatLabel(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}