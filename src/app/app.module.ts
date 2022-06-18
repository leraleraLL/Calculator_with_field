import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputFieldComponent } from './InputField/inputField.component';
import { OutputFieldComponent } from './OutputField/outputField.component';
import { FormsModule } from '@angular/forms';
import { DataService } from "../shared/data.service";

@NgModule({
  declarations: [
    AppComponent,
    InputFieldComponent,
    OutputFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ], 
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
