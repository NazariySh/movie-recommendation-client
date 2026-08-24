import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldModule } from '@angular/cdk/text-field';

import { InputTextComponent } from './input-text/input-text.component';
import { InputEmailComponent } from './input-email/input-email.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { InputTextareaComponent } from './input-textarea/input-textarea.component';
import { InputCheckboxComponent } from './input-checkbox/input-checkbox.component';

const COMPONENTS = [
  InputTextComponent,
  InputEmailComponent,
  InputPasswordComponent,
  InputNumberComponent,
  InputTextareaComponent,
  InputCheckboxComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    TextFieldModule,
  ],
  exports: COMPONENTS,
})
export class FormFieldsModule {}
