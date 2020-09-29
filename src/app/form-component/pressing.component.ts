import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnInit, SkipSelf, ViewChild } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormControl, NgControl, NgModel, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn } from '@angular/forms';
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
          (blur)="propagateTouch(pressingValue)"
          [style.borderColor]="(pressingModel.touched && pressingModel.invalid) ? 'red': ''"
          #pressingModel="ngModel"
          [required]="_required"/>
      </div>
  `
})
export class PressingComponent implements ControlValueAccessor, OnInit {

  @Input()
  public label: string;
  public pressingValue: string;

  public propagateChange = (_: string) => {};
  public propagateTouch = (_: string) => {};

  @ViewChild(NgModel) ngModel: NgModel;

  public _required: boolean;
  @Input()
  public set required(required) {
    this._required = (typeof required === 'string') || required;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private _injector: Injector
  ) {
  }

  public writeValue(pressingValue: string): void {
    this.pressingValue = pressingValue;
  }

  public registerOnChange(fn: (_: string) => {}): void {
    this.propagateChange = fn;
  }
  public registerOnTouched(fn: (_: string) => {}): void {
    this.propagateTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void { }

  // les lignes ci dessous vont vous surprendre...






  // je suis sérieux






  // bon tant pis
  public ngOnInit(): void {
    const self = this;
    // did you get the joke ?
    const selfControl = (this._injector.get(NgControl) as NgControl).control;

    setTimeout(() => {

      if (selfControl?.markAsTouched) {
        const originalMarkAsTouched = selfControl.markAsTouched;

        selfControl.markAsTouched = function () {
          originalMarkAsTouched.apply(this, arguments);
          self.ngModel.control.markAsTouched();
          // au cas ou on voudrait faire du onpush
          self.cd.detectChanges();
        };
      }

      if (selfControl?.updateValueAndValidity) {
        const originalUpdateValueAndValidity = selfControl.updateValueAndValidity;

        selfControl.updateValueAndValidity = function () {
          originalUpdateValueAndValidity.apply(this, arguments);
          self.ngModel.control.updateValueAndValidity();
          self.cd.detectChanges();
        };
      }
    });
  }

  // sinon il y a ça mais bon...
  // https://stackoverflow.com/questions/45911920/how-to-access-the-validator-required-inside-a-custom-component

}
