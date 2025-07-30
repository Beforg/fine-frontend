import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {path:'home', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:HomeComponent}, // Temporário - redireciona para home
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
