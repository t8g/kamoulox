import { Directive, forwardRef, Input, NgModule } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[validatorInjector][ngModel],[validatorInjector][ngFormControl]',
  providers: [{
    multi: true,
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ValidatorInjectorDirective)
  }]
})
export class ValidatorInjectorDirective implements Validator {
  @Input()
  public validatorInjector: ValidatorFn;

  public validate(control: AbstractControl): ValidationErrors|null {
    return this.validatorInjector(control);
  }
}

@NgModule({
  declarations: [
    ValidatorInjectorDirective,
  ],
  exports: [
    ValidatorInjectorDirective
  ]
})
export class ValidatorInjectorModule {}
