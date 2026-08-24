import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleButtonConfiguration } from '../models/google-identity';

const GSI_POLL_INTERVAL_MS = 100;
const GSI_LOAD_TIMEOUT_MS = 10_000;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly credential$ = new Subject<string>();
  private initialized = false;

  public get isConfigured(): boolean {
    return !!environment.googleClientId;
  }

  public get credential(): Observable<string> {
    return this.credential$.asObservable();
  }

  public renderButton(host: HTMLElement, options: GoogleButtonConfiguration = {}): Observable<string> {
    if (!this.isConfigured) {
      return throwError(() => new Error('Google client ID is not configured'));
    }

    this.ensureLoaded()
      .then(() => {
        this.initialize();
        window.google!.accounts.id.renderButton(host, this.applyDefaults(options));
      })
      .catch(err => this.credential$.error(err));

    return this.credential$.asObservable();
  }

  public signIn(): Observable<string> {
    if (!this.isConfigured) {
      return throwError(() => new Error('Google client ID is not configured'));
    }

    this.ensureLoaded()
      .then(() => {
        this.initialize();
        window.google!.accounts.id.prompt();
      })
      .catch(err => this.credential$.error(err));

    return this.credential$.asObservable();
  }

  private initialize(): void {
    if (this.initialized) {
      return;
    }

    window.google!.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: response => this.credential$.next(response.credential),
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
      use_fedcm_for_prompt: true,
    });

    this.initialized = true;
  }

  private async ensureLoaded(): Promise<void> {
    if (window.google?.accounts?.id) {
      return;
    }

    const start = Date.now();

    while (!window.google?.accounts?.id) {
      if (Date.now() - start > GSI_LOAD_TIMEOUT_MS) {
        throw new Error('Google Identity Services failed to load');
      }
      await new Promise(resolve => setTimeout(resolve, GSI_POLL_INTERVAL_MS));
    }
  }

  private applyDefaults(options: GoogleButtonConfiguration): GoogleButtonConfiguration {
    return {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 400,
      ...options,
    };
  }
}
