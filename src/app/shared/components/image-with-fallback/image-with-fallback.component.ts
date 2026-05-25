import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-with-fallback',
  templateUrl: './image-with-fallback.component.html',
  styleUrl: './image-with-fallback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class ImageWithFallbackComponent {
  @Input() public src: string | null | undefined = null;
  @Input() public alt = '';
  @Input() public fallback = 'images/placeholder.png';
  @Input() public imgClass = '';

  public get currentSrc(): string {
    return this.src ?? this.fallback;
  }

  public onError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.fallback) {
      img.src = this.fallback;
    }
  }
}
