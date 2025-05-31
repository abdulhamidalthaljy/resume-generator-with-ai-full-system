import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResumeFormComponent } from './components/resume-form.component';
import { ResumePreviewComponent } from './components/resume-preview/resume-preview.component';
import { ResumeBuilderComponent } from './components/resume-builder/resume-builder.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resume/new',
    component: ResumeBuilderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resume/:id',
    component: ResumeBuilderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resume/:id/edit',
    component: ResumeBuilderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resume/:id/preview',
    component: ResumePreviewComponent,
    canActivate: [AuthGuard],
  },
  // Keep old routes for backward compatibility
  {
    path: 'resume/old/new',
    component: ResumeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resume/old/:id',
    component: ResumeFormComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  static routes = routes;
}
