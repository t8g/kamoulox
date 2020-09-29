import { Component, Input, OnInit, SkipSelf } from "@angular/core";
import { ControlContainer } from '@angular/forms';
import { Canard } from '../models/canard';

export const controlContainerFactory = (container: ControlContainer) => container;

@Component({
  selector: "kmx-canard",
  viewProviders: [
    // https://stackoverflow.com/questions/39242219/angular2-nested-template-driven-form#answer-46748943
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new SkipSelf(), ControlContainer]],
    }
  ],
  template: `
      <div class="form-group" [ngModelGroup]="componentId" #modelGroup="ngModelGroup">
        <label>canard</label>
        <input type="text"
          name="name"
          [style.borderColor]="(nameModel.touched && nameModel.invalid) ? 'red': ''"
          [(ngModel)]="canard.name"
          #nameModel="ngModel"
          required/>
        <input type="checkbox" name="isBlue" [(ngModel)]="isBlue"/> ce cannard est bleu
      </div>
  `
})
export class CanardComponent {
  public componentId: string = 'canard';

  @Input()
  public canard: Canard;

  public get isBlue(): boolean {
    return this.canard.color === 'blue';
  }

  public set isBlue(value: boolean) {
    this.canard.color = value ? 'blue' : 'red';
  }

  constructor() {

  }
}
