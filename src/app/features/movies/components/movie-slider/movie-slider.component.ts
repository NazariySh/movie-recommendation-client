import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Params } from '@angular/router';
import { Movie } from '../../../../core/models/movie';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AppPaths } from '../../../../core/constants/app-routes';

@Component({
  selector: 'app-movie-slider',
  templateUrl: './movie-slider.component.html',
  styleUrl: './movie-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieSliderComponent {
  @Input({ required: true }) public title!: string;
  @Input() public movies: Movie[] = [];
  @Input() public viewAllPath: string | null = AppPaths.MOVIES;
  @Input() public viewAllQueryParams: Params = {};

  public readonly AppIcon = AppIcon;

  @ViewChild('sliderContent') public sliderContent!: ElementRef<HTMLDivElement>;

  public scroll(direction: 'left' | 'right'): void {
    const container = this.sliderContent.nativeElement;
    const scrollAmount = 250; 
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
