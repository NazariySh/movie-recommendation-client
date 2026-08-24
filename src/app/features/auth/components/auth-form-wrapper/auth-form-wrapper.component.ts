import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-wrapper',
  templateUrl: './auth-form-wrapper.component.html',
  styleUrl: './auth-form-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormWrapperComponent {
  @Input() public titleKey = '';
  @Input() public subtitleKey = '';
}
