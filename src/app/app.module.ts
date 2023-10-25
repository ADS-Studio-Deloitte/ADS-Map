import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { AddMarkerDialogComponent } from './components/add-marker-dialog/add-marker-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput, MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from '@angular-material-components/color-picker';

@NgModule({
  declarations: [
    AppComponent,
    AddMarkerDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMatColorPickerModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
