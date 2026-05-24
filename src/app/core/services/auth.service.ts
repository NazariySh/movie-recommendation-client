import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginDto, RegisterDto } from '../models/user.model';

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface ForgotPasswordDto {
  email: string;
}

interface ResetPasswordDto {
  userId: string;
  token: string;
  newPassword: string;
}

interface VerifyEmailDto {
  userId: string;
  token: string;
}

interface ResendVerificationDto {
  email: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface GoogleAuthDto {
  idToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly AccessTokenStorageKey = 'app_access_token';

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private _accessToken: string | null = null;

  private readonly _user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this._user$.asObservable();
  readonly isAuthenticated$ = this.user$.pipe(map(u => !!u));

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this._accessToken = AuthService.readStoredToken();
  }

  public get accessToken(): string | null {
    return this._accessToken;
  }

  public hasRole$(role: string): Observable<boolean> {
    return this.user$.pipe(map(u => u?.roles.includes(role) ?? false));
  }

  public login(dto: LoginDto): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto, { withCredentials: true }).pipe(
      tap(res => this.setSession(res.accessToken, res.user)),
      map(res => res.user)
    );
  }

  public loginWithGoogle(idToken: string): Observable<User> {
    const body: GoogleAuthDto = { idToken };
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, body, { withCredentials: true }).pipe(
      tap(res => this.setSession(res.accessToken, res.user)),
      map(res => res.user)
    );
  }

  public register(dto: RegisterDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, dto, { withCredentials: true });
  }

  public verifyEmail(dto: VerifyEmailDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, dto);
  }

  public resendVerification(dto: ResendVerificationDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/resend-verification`, dto);
  }

  public forgotPassword(dto: ForgotPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, dto);
  }

  public resetPassword(dto: ResetPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, dto);
  }

  public changePassword(dto: ChangePasswordDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, dto);
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/']);
      }),
      catchError(() => {
        this.clearSession();
        this.router.navigate(['/']);
        return of(undefined);
      })
    );
  }

  public refreshToken(): Observable<string> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(res => this.setSession(res.accessToken, res.user)),
      map(res => res.accessToken)
    );
  }

  public loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => this._user$.next(user)),
      catchError(() => {
        this._user$.next(null);
        return of(null);
      })
    );
  }

  public clearSession(): void {
    this._accessToken = null;
    AuthService.writeStoredToken(null);
    this._user$.next(null);
  }

  public patchCurrentUser(partial: Partial<User>): void {
    const current = this._user$.value;
    if (!current) return;
    this._user$.next({ ...current, ...partial });
  }

  private setSession(token: string, user: User): void {
    this._accessToken = token;
    AuthService.writeStoredToken(token);
    this._user$.next(user);
  }

  private static readStoredToken(): string | null {
    try {
      return localStorage.getItem(AuthService.AccessTokenStorageKey);
    } catch {
      return null;
    }
  }

  private static writeStoredToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem(AuthService.AccessTokenStorageKey, token);
      } else {
        localStorage.removeItem(AuthService.AccessTokenStorageKey);
      }
    } catch (e) {
      void e;
    }
  }
}
