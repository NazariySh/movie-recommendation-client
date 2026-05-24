import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Artist } from '../../../../core/models/artist';
import { AppRoutes } from '../../../../core/constants/app-routes';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCardComponent {
  public readonly AppRoutes = AppRoutes;

  @Input() public artist!: Artist;
}
