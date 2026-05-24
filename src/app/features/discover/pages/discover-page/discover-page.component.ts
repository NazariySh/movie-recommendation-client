import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Movie } from '../../../../core/models/movie';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AppPaths, AuthPaths } from '../../../../core/constants/app-routes';
import { DiscoverSection } from '../../models/discover-section.model';
import { DiscoverFacade } from '../../services/discover.facade';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrl: './discover-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverPageComponent implements OnInit {
  public readonly forYou$: Observable<DiscoverSection>;
  public readonly trendingMovies$: Observable<DiscoverSection>;
  public readonly trendingSeries$: Observable<DiscoverSection>;
  public readonly popular$: Observable<DiscoverSection>;
  public readonly featured$: Observable<Movie | null>;

  public readonly user$: Observable<User | null>;
  public readonly isAuthenticated$: Observable<boolean>;

  public readonly loginPath = AuthPaths.LOGIN;
  public readonly moviesPath = AppPaths.MOVIES;

  public constructor(
    private readonly facade: DiscoverFacade,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.forYou$ = this.facade.forYou$;
    this.trendingMovies$ = this.facade.trendingMovies$;
    this.trendingSeries$ = this.facade.trendingSeries$;
    this.popular$ = this.facade.popular$;
    this.featured$ = this.facade.featured$;
    this.user$ = this.auth.user$;
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  public ngOnInit(): void {
    this.facade.load();
  }

  public goToLogin(): void {
    this.router.navigateByUrl(this.loginPath);
  }
}
