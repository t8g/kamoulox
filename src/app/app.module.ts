import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { FormComponent } from "./form.component";
import { CanardComponent } from './form-component/coin-coin.component';
import { ValidatorInjectorModule } from './magic/validator-injector.module';
import { PressingComponent } from './form-component/pressing.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    CanardComponent,
    PressingComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    ValidatorInjectorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
