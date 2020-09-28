import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { KamouloxService } from "./services/kamoulox.service";
import { KamouloxConfigSubject } from "./services/config.subject";
import { KamouloxSubject } from "./services/data.subject";
import { IKamoulox } from './models/kamoulox';

@Component({
  selector: "kmx-form",
  template: `
  <form name="kamouloxForm" #kamouloxForm="ngForm" novalidate>
    <kmx-canard [canard]="kamoulox.canard"></kmx-canard>
    </form>
    <form [formGroup]="form">
      <div class="form-group">
        <label>canard</label>
        <input formControlName="canard" />
      </div>
      <div class="form-group">
        <label>beaujolais</label>
        <input formControlName="beaujolais" type="number" />
      </div>
      <div class="form-group" *ngIf="config$.mitterrand.visible | async">
        <label>mitterrand</label>
        <select formControlName="mitterrand">
          <option>parapluie</option>
          <option>homard</option>
        </select>
      </div>
      <div class="form-group">
        <label>{{ config$.pressing.label | async }}</label>
        <input formControlName="pressing" />
      </div>
      <button>Kamoulox !</button>
    </form>
  `
})
export class FormComponent implements OnInit {

  kamoulox: IKamoulox = {
    canard: {
      name: 'tintin'
    }
  };

  form = new FormGroup({
    canard: new FormControl(),
    beaujolais: new FormControl(),
    mitterrand: new FormControl(),
    pressing: new FormControl()
  });
  config$: KamouloxConfigSubject;
  kamoulox$: KamouloxSubject;

  constructor(private kamouloxService: KamouloxService) {
    this.config$ = kamouloxService.config$;
    this.kamoulox$ = kamouloxService.kamoulox$;

    this.form.valueChanges.subscribe(kamoulox => this.kamoulox$.next(kamoulox));

    this.kamoulox$.subscribe(kamoulox =>
      this.form.patchValue(kamoulox, { emitEvent: false })
    );

    // Release the Kraken!
    this.kamouloxService.init().subscribe();
  }

  ngOnInit() {}
}
