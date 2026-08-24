import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrl: '../form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputEmailComponent extends BaseInputComponent {
  override autocomplete = 'email';
}
