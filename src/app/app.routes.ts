import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { AdministracaoComponent } from './pages/administracao/administracao.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PoliticasTermosComponent } from './pages/politicas-termos/politicas-termos.component';

export const routes: Routes = [
    {path:'home', component:HomeComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent}, 
    {path:'perfil', component: PerfilComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'agendamento/:barbeiroId', component: AgendamentoComponent},
    {path: 'politicas-termos', component: PoliticasTermosComponent},
    {path: 'admin', component: AdministracaoComponent, canActivate: [AuthGuardService]}
];
