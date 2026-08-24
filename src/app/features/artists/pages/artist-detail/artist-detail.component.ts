import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ArtistDetail } from '../../../../core/models/artist-detail';
import { FilmographyItem } from '../../../../core/models/filmography';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AppPaths, AppRoutes } from '../../../../core/constants/app-routes';
import { ArtistService } from '../../services/artist.service';

type DetailTab = 'information' | 'gallery' | 'works';

interface DetailTabDef {
  id: DetailTab;
  labelKey: string;
}

interface RoleGroup {
  role: string;
  count: number;
  items: FilmographyItem[];
}

type DetailState =
  | { status: 'loading' }
  | { status: 'loaded'; artist: ArtistDetail; roleGroups: RoleGroup[]; lifeYears: string | null }
  | { status: 'error' };

const BIO_COLLAPSE_THRESHOLD = 500;

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrl: './artist-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailComponent implements OnInit {
  public readonly AppIcon = AppIcon;
  public readonly bioCollapseThreshold = BIO_COLLAPSE_THRESHOLD;

  public readonly detailTabs: DetailTabDef[] = [
    { id: 'information', labelKey: 'ARTISTS.TAB.INFORMATION' },
    { id: 'works', labelKey: 'ARTISTS.TAB.WORKS' },
  ];

  public activeTab: DetailTab = 'information';
  public activeRoleId = '';
  public bioExpanded = false;

  public state$!: Observable<DetailState>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly artistService: ArtistService,
  ) {}

  public ngOnInit(): void {
    this.state$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (!id) {
          return of<DetailState>({ status: 'error' });
        }
        return this.artistService.getArtistById(id).pipe(
          map<ArtistDetail, DetailState>((artist) => this.buildLoadedState(artist)),
          catchError(() => of<DetailState>({ status: 'error' })),
        );
      }),
      tap((s) => {
        if (s.status === 'loaded') {
          this.syncActiveRole(s.roleGroups);
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  public setTab(tab: DetailTab): void {
    this.activeTab = tab;
  }

  public setActiveRole(role: string): void {
    this.activeRoleId = role;
  }

  public toggleBio(): void {
    this.bioExpanded = !this.bioExpanded;
  }

  public goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([AppPaths.ARTISTS]);
    }
  }

  public movieLink(movieKey: string): unknown[] {
    return ['/', AppRoutes.MOVIE_DETAIL, movieKey];
  }

  public workSubtitle(item: FilmographyItem): string | null {
    const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
    if (year && item.character) return `${year} · ${item.character}`;
    if (year) return String(year);
    return item.character ?? null;
  }

  private buildLoadedState(artist: ArtistDetail): DetailState {
    const byRole = artist.filmography?.byRole ?? {};
    const roleGroups: RoleGroup[] = Object.entries(byRole)
      .map(([role, items]) => ({
        role,
        items: items ?? [],
        count: (items ?? []).length,
      }))
      .filter((group) => group.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      status: 'loaded',
      artist,
      roleGroups,
      lifeYears: this.calcLifeYears(artist.birthday, artist.dateOfDeath),
    };
  }

  private syncActiveRole(roleGroups: RoleGroup[]): void {
    if (!roleGroups.length) {
      this.activeRoleId = '';
      return;
    }
    if (!roleGroups.some((g) => g.role === this.activeRoleId)) {
      this.activeRoleId = roleGroups[0].role;
    }
  }

  private calcLifeYears(birthday: string | null, dateOfDeath: string | null): string | null {
    if (!birthday) {
      return null;
    }
    const birth = new Date(birthday);
    const birthYear = birth.getFullYear();

    if (dateOfDeath) {
      const death = new Date(dateOfDeath);
      const deathYear = death.getFullYear();
      const age = this.calcAge(birth, death);
      return `${birthYear}-${deathYear} (${age})`;
    }

    return `${birthYear} (${this.calcAge(birth, new Date())})`;
  }

  private calcAge(birth: Date, on: Date): number {
    let age = on.getFullYear() - birth.getFullYear();
    const monthDiff = on.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
