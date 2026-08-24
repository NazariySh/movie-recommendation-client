import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonShape = 'card' | 'line' | 'circle' | 'rectangle';

@Component({
  selector: 'app-skeleton-loader',
  template: `
    <div class="skeleton skeleton--{{ shape }}"
         [style.width]="width"
         [style.height]="height">
    </div>
  `,
  styleUrl: './skeleton-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class SkeletonLoaderComponent {
  @Input() public shape: SkeletonShape = 'rectangle';
  @Input() public width = '100%';
  @Input() public height = '1rem';
}
