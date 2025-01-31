import { Routes } from '@angular/router';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { ChitPlansComponent } from './chitplans/chitplans.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { GroupTransactionsComponent } from './group-transactions/group-transactions.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { MonthlyPlanComponent } from './monthly-plan/monthly-plan.component';
import { MonthlyTrackerComponent } from './monthly-tracker/monthly-tracker.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { ViewUserTransactionsComponent } from './view-user-transactions/view-user-transactions.component';


export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'mygroups', component: MyGroupsComponent },
    { path: 'chitplans', component: ChitPlansComponent },
    { path: 'plan', component: PlanDetailsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'mytransactions', component: MyTransactionsComponent },
    { path: 'create-group', component: GroupFormComponent },
    { path: 'groups/:groupId', component: GroupDetailsComponent },
    { path: 'transactions/:groupId/:userId', component: ViewUserTransactionsComponent },
    { path: 'groups/:groupId/transactions', component: GroupTransactionsComponent },
    { path: 'groups/:groupId/installments', component: MonthlyTrackerComponent },
    { path: 'groups/:groupId/users/:userId', component: AddTransactionComponent },
    { path: 'plan-month', component: MonthlyPlanComponent },
];
