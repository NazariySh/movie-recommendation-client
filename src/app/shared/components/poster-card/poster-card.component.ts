import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ImageWithFallbackComponent } from '../image-with-fallback/image-with-fallback.component';

@Component({
  selector: 'app-poster-card',
  templateUrl: './poster-card.component.html',
  styleUrl: './poster-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ImageWithFallbackComponent],
})
export class PosterCardComponent {
  @Input() public posterUrl?: string | null;
  @Input() public title = '';
  @Input() public subtitle?: string | null;
  @Input() public rating?: number | null;
  @Input() public link?: string | unknown[] | null;
  @Input() public fallback = 'images/placeholder.png';
  @Input({ transform: booleanAttribute }) public showRating = true;
  @Input({ transform: booleanAttribute }) public bookmarked = false;
  @Input({ transform: booleanAttribute }) public showBookmark = false;

  @Output() public readonly cardClick = new EventEmitter<void>();
  @Output() public readonly bookmarkToggle = new EventEmitter<boolean>();

  public get hasRating(): boolean {
    return this.showRating && this.rating !== null && this.rating !== undefined && this.rating > 0;
  }

  public get linkValue(): string | unknown[] | null {
    return this.link ?? null;
  }

  public onCardClick(): void {
    this.cardClick.emit();
  }

  public onCardKeyboardActivate(event: Event): void {
    event.preventDefault();
    this.cardClick.emit();
  }

  public onBookmarkClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkToggle.emit(!this.bookmarked);
  }
}
