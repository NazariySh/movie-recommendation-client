import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../../../core/models/movie';
import { AppRoutes } from '../../../../core/constants/app-routes';
import { AppIcon } from '../../../../core/constants/app-icons';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  @Input() public movie: Movie | null = null;

  public readonly AppIcon = AppIcon;

  constructor(private readonly router: Router) {}

  public navigateToDetail(): void {
    if (!this.movie) return;
    this.router.navigate(['/', AppRoutes.MOVIE_DETAIL, this.movie.id]);
  }
}
