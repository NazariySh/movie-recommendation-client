import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrl: '../form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextareaComponent extends BaseInputComponent {
  @Input() minRows = 3;
  @Input() maxRows = 10;
}
