import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, NgForm, Validators } from "@angular/forms";
import { Kamoulox, KamouloxService } from "./services/kamoulox.service";
import { KamouloxConfigSubject } from "./services/config.subject";
import { KamouloxSubject } from "./services/data.subject";
import { IKamoulox } from './models/kamoulox';
import { delay } from 'rxjs/operators';

@Component({
  selector: "kmx-form",
  template: `
    <form name="kamouloxForm" #kamouloxForm="ngForm" novalidate autocomplete="off" (ngSubmit)="onSubmit()">
      <kmx-canard [canard]="kamoulox.canard"></kmx-canard>
      <div class="form-group">
        <label>beaujolais</label>
        <input
          name="beaujolais"
          [(ngModel)]="kamoulox.beaujolais"
          [style.borderColor]="(beaujolaisModel.touched && beaujolaisModel.invalid) ? 'red': ''"
          #beaujolaisModel="ngModel"
          type="number"
          [validatorInjector]="minOneValidator"/>
      </div>
      <div class="form-group" *ngIf="config$.mitterrand.visible | async">
        <label>
          mitterrand
        </label>
        <select name="mitterrand" [(ngModel)]="kamoulox.mitterrand" [disabled]="config$.mitterrand.disabled | async">
          <option>parapluie</option>
          <option>homard</option>
        </select>
      </div>
      <kmx-pressing [label]='config$.pressing.label | async' name="pressing" [(ngModel)]="kamoulox.pressing" required></kmx-pressing>
      <!-- <div class="form-group">
        <label>{{ config$.pressing.label | async }}</label>
        <input name="pressing" [(ngModel)]="kamoulox.pressing" />
      </div> -->
      <button type="submit">Kamoulox !</button>

    </form>
  `
})
export class FormComponent implements OnInit, AfterViewInit {

  public minOneValidator = Validators.min(1);

  kamoulox: Kamoulox;

  // form = new FormGroup({
  //   canard: new FormControl(),
  //   beaujolais: new FormControl(),
  //   mitterrand: new FormControl(),
  //   pressing: new FormControl()
  // });

  @ViewChild('kamouloxForm')
  public kamouloxNgForm: NgForm;

  config$: KamouloxConfigSubject;
  kamoulox$: KamouloxSubject;

  constructor(private kamouloxService: KamouloxService) {
    this.config$ = this.kamouloxService.config$;
    this.kamoulox$ = this.kamouloxService.kamoulox$;

    this.kamoulox = this.kamoulox$.value;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.kamouloxNgForm.form.valueChanges
    .pipe(delay(0))
    .subscribe(() => {
      this.kamoulox$.next(this.deepDuplicate(this.kamoulox));
    });

    this.kamoulox$.subscribe(kamoulox => {
      this.kamoulox = this.deepDuplicate(kamoulox);
    });

    // Release the Kraken!
    this.kamouloxService.init().subscribe();
  }

  public onSubmit(): void {
    this.kamouloxNgForm.form.markAllAsTouched();
    console.log('this.kamoulox', this.kamoulox);
    if (this.kamouloxNgForm.form.valid) {
      console.log('this form is valid');
    } else {
      console.log('this form is NOT valid');
    }
  }

  private deepDuplicate<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
  }
}
