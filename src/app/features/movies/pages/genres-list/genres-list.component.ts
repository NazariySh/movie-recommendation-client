import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { Genre } from '../../../../core/models/genre';
import { AppIcon } from '../../../../core/constants/app-icons';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-genres-list',
  templateUrl: './genres-list.component.html',
  styleUrl: './genres-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenresListComponent implements OnInit {
  public readonly AppIcon = AppIcon;
  public genres$!: Observable<Genre[]>;

  constructor(private readonly movieService: MovieService) {}

  public ngOnInit(): void {
    this.genres$ = this.movieService.getGenres().pipe(
      catchError(() => of<Genre[]>([])),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
