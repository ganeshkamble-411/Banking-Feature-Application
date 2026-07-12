import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ContactComponent } from './pages/contact/contact.component';
import { WalletComponent } from './pages/wallet/wallet.component'; // 🟢 Naya component import kiya

export const routes: Routes = [

  // 1. Default Route (Sabse pehle login par bhejega)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 2. Authentication Routes
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // 3. Core Banking Application Routes
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
  // 🟢 NAYA ROUTE: My Wallet Page Config
  {
    path: 'wallet',
    component: WalletComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },

  // 4. Wildcard Route (Agar user ajeeb URL type kare toh safe fallback to login)
  {
    path: '**',
    redirectTo: 'login'
  }
];
