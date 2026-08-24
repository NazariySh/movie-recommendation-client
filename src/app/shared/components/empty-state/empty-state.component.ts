import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
})
export class EmptyStateComponent {
  @Input() public icon = 'search_off';
  @Input() public titleKey = 'EMPTY_STATE.NO_RESULTS';
  @Input() public descKey = 'EMPTY_STATE.NO_RESULTS_DESC';
  @Input() public ctaLabelKey: string | null = null;
  @Output() public ctaClick = new EventEmitter<void>();
}
