import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BinComponent } from './bin/bin.component';
import { NotebooksComponent } from './notebooks/notebooks.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'bin', component: BinComponent},
    {path: 'notebooks', component: NotebooksComponent},
    //newly added routes
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'signup', component: SignupComponent},
    //
    {path: '404-page', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/404-page'}

];
