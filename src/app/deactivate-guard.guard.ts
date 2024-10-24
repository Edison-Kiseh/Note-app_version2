import { CanActivateFn, CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
};

export const deactivateGuardGuard: CanDeactivateFn<CanComponentDeactivate> = 
  (component: CanComponentDeactivate) => {
  return component.canDeactivate();
};


