import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  template: `
    <div class="avatar avatar--{{ size }}">
      <img *ngIf="src; else initialsBlock" [src]="src" [alt]="name" class="avatar__img" (error)="showInitials = true" />
      <ng-template #initialsBlock>
        <span class="avatar__initials">{{ getInitials() }}</span>
      </ng-template>
    </div>
  `,
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class AvatarComponent {
  @Input() public src: string | null | undefined = null;
  @Input() public name = '';
  @Input() public size: 'sm' | 'md' | 'lg' = 'md';

  public showInitials = false;

  public getInitials(): string {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join('');
  }
}
