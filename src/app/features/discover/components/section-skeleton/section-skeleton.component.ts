import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-skeleton',
  templateUrl: './section-skeleton.component.html',
  styleUrl: './section-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionSkeletonComponent {
  @Input() public titleKey = '';
  @Input() public count = 6;

  public get cards(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
