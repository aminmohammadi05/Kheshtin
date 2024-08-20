import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Category } from '../../models/category';

// @Injectable makes to available services in root level.
@Injectable({providedIn: 'root'})
export class CategoriesQuickAccessService {
  categorySubject = new Subject<Category>();
}
