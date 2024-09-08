import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { AuthGuard } from './common/gaurd/auth.gaurd';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'restaurant/add',
        component: RestaurantComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'restaurant/edit/:id',
        component: RestaurantComponent,
        canActivate:[AuthGuard]
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'admin/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
