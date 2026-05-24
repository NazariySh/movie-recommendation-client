import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrl: '../form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends BaseInputComponent {}
