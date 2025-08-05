import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
    {path:'home', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent}, 
    {path:'perfil', component: PerfilComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
