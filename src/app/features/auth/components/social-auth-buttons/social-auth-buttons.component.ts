import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleAuthService } from '../../../../core/services/google-auth.service';

@Component({
  selector: 'app-social-auth-buttons',
  templateUrl: './social-auth-buttons.component.html',
  styleUrl: './social-auth-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthButtonsComponent implements OnInit {
  @Output() public googleLogin = new EventEmitter<string>();

  constructor(
    private readonly googleAuth: GoogleAuthService,
    private readonly destroyRef: DestroyRef
  ) {}

  public get isConfigured(): boolean {
    return this.googleAuth.isConfigured;
  }

  public ngOnInit(): void {
    if (!this.isConfigured) {
      return;
    }

    this.googleAuth.credential
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(idToken => this.googleLogin.emit(idToken));
  }

  public signInWithGoogle(): void {
    this.googleAuth.signIn();
  }
}
