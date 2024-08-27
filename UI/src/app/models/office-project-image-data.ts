import { Observable } from "rxjs";
import { OfficeProject } from "./office-project";

export interface OfficeProjectImageData {
    officeProject: Observable<OfficeProject>;
    index: number;
  }