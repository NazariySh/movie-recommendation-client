import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { AppIcon } from '../../../../core/constants/app-icons';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrl: '../form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent extends BaseInputComponent {
  public readonly AppIcon = AppIcon;
  public override autocomplete = 'current-password';
  public visible = false;
}
