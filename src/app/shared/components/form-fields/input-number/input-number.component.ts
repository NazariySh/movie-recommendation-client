import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrl: '../form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends BaseInputComponent {
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
}
