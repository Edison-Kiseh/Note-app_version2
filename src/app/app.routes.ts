import { Routes } from '@angular/router';
import { HomeComponent } from './note-app/home/home.component';
import { BinComponent } from './bin/bin.component';
import { NotebooksComponent } from './note-app/notebooks/notebooks.component';
import { PageNotFoundComponent } from './note-app/page-not-found/page-not-found.component';
import { LogoutComponent } from './note-app/logout/logout.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { StartupComponent } from './startup/startup.component';
import { loggedInGuard } from './logged-in.guard';
import { AdminComponent } from './admin/admin.component';
import { loggedOutGuard } from './logged-out.guard';
import { adminGuardGuard } from './admin-guard.guard';
import { HomeNotebooksComponent } from './note-app/home-notebooks/home-notebooks.component';
import { deactivateGuardGuard } from './deactivate-guard.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate:[loggedInGuard]},
    {path: 'bin', component: BinComponent, canActivate:[loggedInGuard]},
    {path: 'notebooks', component: NotebooksComponent, canActivate:[loggedInGuard],  children: [
        {path: ':notebookId', component: HomeNotebooksComponent},
    ]},
    //newly added routes
    {path: 'login', component: LoginComponent, canActivate:[loggedOutGuard]},
    {path: 'logout', component: LogoutComponent, canActivate:[loggedOutGuard]},
    {path: 'signup', component: SignupComponent, canActivate:[loggedOutGuard]},
    {path: 'startup', component: StartupComponent},
    {path: 'admin', component: AdminComponent, canActivate:[adminGuardGuard], canDeactivate: [deactivateGuardGuard]},
    //
    {path: '404-page', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/404-page'}

];
