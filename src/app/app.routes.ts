import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BinComponent } from './bin/bin.component';
import { NotebooksComponent } from './notebooks/notebooks.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { StartupComponent } from './startup/startup.component';
import { loggedInGuard } from './logged-in.guard';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate:[loggedInGuard]},
    {path: 'bin', component: BinComponent, canActivate:[loggedInGuard]},
    {path: 'notebooks', component: NotebooksComponent, canActivate:[loggedInGuard]},
    //newly added routes
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'startup', component: StartupComponent},
    {path: 'admin', component: AdminComponent},
    //
    {path: '404-page', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/404-page'}

];
