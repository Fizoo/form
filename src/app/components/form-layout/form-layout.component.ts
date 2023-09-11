import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MyValidators} from "../../helper/emailAsyncValidator";
import {debounceTime, Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-form-layout',
  templateUrl: './form-layout.component.html',
  styleUrls: ['./form-layout.component.scss'],
  providers: [DatePipe]
})
export class FormLayoutComponent implements OnInit,OnDestroy {
  form: FormGroup

   private unsubscribe$=new Subject<void>();


  frameworkVersions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  }
  frameworks = ['angular', 'react', 'vue']

  constructor(private fb: FormBuilder,
              private datePipe: DatePipe,) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      framework: ['', Validators.required],
      frameworkVersion: [{value: '', disabled: true}, Validators.required],
      email: ['', [Validators.required, Validators.email], [MyValidators.emailAsyncValidator]],
      hobbies: this.fb.array([this.createHobby()])
    })

    this.framework.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(200),
    ).subscribe(value => {
        if (value) {
          this.frameworkVersion.enable()
        } else
          this.frameworkVersion.disable()
      })
  }

  createHobby(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      duration: ['', Validators.required]
    })
  }

  addHobby(): void {
    this.hobbies.push(this.createHobby())
  }

  deleteHobby(index: number): void {
    this.hobbies.removeAt(index)
  }

  onSubmit() {
    if (this.form.valid) {
      const {dateOfBirth} = this.form.value

      const data = {
        ...this.form.value,
        dateOfBirth: this.datePipe.transform(dateOfBirth, 'dd-MM-yyyy')
      }

      console.log('Form submitted with value:', data);
    }
    else  console.error('Form is invalid');
  }

  get firstName() {
    return this.form.controls['firstName']
  }

  get lastName() {
    return this.form.controls['lastName']
  }

  get dateOfBirth() {
    return this.form.controls['dateOfBirth']
  }

  get framework() {
    return this.form.controls['framework']
  }

  get frameworkVersion() {
    return this.form.controls['frameworkVersion']
  }

  get email() {
    return this.form.controls['email']
  }

  get hobbies() {
    return (this.form.controls['hobbies'] as FormArray)
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
