// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // Provide HTTP Client
import { AppComponent } from './app/app.component'; // Import your root component
import { routes } from './app/app.routes'; // Import your routing

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Provide HTTP client here
    provideRouter(routes)  // Add routing provider
  ]
});
