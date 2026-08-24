import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrl: './input-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckboxComponent extends BaseInputComponent {}
