import { Component, forwardRef, Input, OnInit, SkipSelf } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Canard } from '../models/canard';


@Component({
  selector: "kmx-pressing",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PressingComponent),
      multi: true
    },
  ],
  template: `
      <div class="form-group">
        <label>{{ label }}</label>
        <input name="pressing"
          [(ngModel)]="pressingValue"
          (ngModelChange)="propagateChange(pressingValue)"
          (blur)="propagateTouch(pressingValue)"/>
      </div>
<!--

      <div class="form-group" [ngModelGroup]="componentId" #modelGroup="ngModelGroup">
        <label>canard</label>
        <input type="text"
          name="name"
          [style.borderColor]="(nameModel.touched && nameModel.invalid) ? 'red': ''"
          [(ngModel)]="canard.name"
          #nameModel="ngModel"
          [validatorInjector]="canardValidator"
          required/>
        <input type="checkbox" name="isBlue" [(ngModel)]="isBlue"/> ce cannard est bleu
      </div> -->
  `
})
export class PressingComponent implements ControlValueAccessor {

  @Input()
  public label: string;
  public pressingValue: string;

  public propagateChange = (_: string) => {};
  public propagateTouch = (_: string) => {};

  constructor() {
  }

  public writeValue(pressingValue: string): void {
    console.log('pressingvalue', pressingValue);
    this.pressingValue = pressingValue;
  }

  public registerOnChange(fn: (_: string) => {}): void {
    this.propagateChange = fn;
  }
  public registerOnTouched(fn: (_: string) => {}): void {
    this.propagateTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void { }
}
