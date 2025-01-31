// src/app/app.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Import routing module
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { FooterComponent } from './footer/footer.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { GroupTransactionsComponent } from './group-transactions/group-transactions.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MonthlyPlanComponent } from './monthly-plan/monthly-plan.component';
import { MonthlyTrackerComponent } from './monthly-tracker/monthly-tracker.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { ViewUserTransactionsComponent } from './view-user-transactions/view-user-transactions.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterModule, HomePageComponent, CommonModule, NavbarComponent, ReactiveFormsModule, FooterComponent, RegistrationComponent, MyGroupsComponent, PlanDetailsComponent, ProfileComponent, MyTransactionsComponent, GroupFormComponent, GroupDetailsComponent, ViewUserTransactionsComponent, GroupTransactionsComponent, MonthlyTrackerComponent, AddTransactionComponent, MonthlyPlanComponent],  // Add your routing modules here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Your component logic
}
