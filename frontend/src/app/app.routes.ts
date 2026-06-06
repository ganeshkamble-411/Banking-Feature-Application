import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [

  // Default Route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Authentication Routes
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // Banking Application Routes
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'transfer',
    component: TransferComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },

  // Invalid URL
  {
    path: '**',
    redirectTo: 'login'
  }
];