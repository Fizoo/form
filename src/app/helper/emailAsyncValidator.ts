import {AbstractControl, ValidationErrors} from "@angular/forms";
import {Observable, of, switchMap, timer} from "rxjs";

export class MyValidators {

  static emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(2000).pipe(
      switchMap(() => {
        if (control.value === 'test@test.test') {
          return of({emailExists: true})
        } else return of(null)
      })
    )

  }
}
