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
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type ChipVariant = 'solid' | 'outline' | 'ghost';
export type ChipSize = 'sm' | 'md';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
})
export class ChipComponent {
  @Input() public label = '';
  @Input() public icon?: string;
  @Input() public badge?: string | number | null;
  @Input() public variant: ChipVariant = 'solid';
  @Input() public size: ChipSize = 'md';
  @Input({ transform: booleanAttribute }) public active = false;
  @Input({ transform: booleanAttribute }) public removable = false;
  @Input({ transform: booleanAttribute }) public clickable = false;
  @Input({ transform: booleanAttribute }) public disabled = false;

  @Output() public readonly remove = new EventEmitter<void>();
  @Output() public readonly chipClick = new EventEmitter<void>();

  public onChipClick(): void {
    if (this.disabled) {
      return;
    }
    if (this.clickable) {
      this.chipClick.emit();
    }
  }

  public onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.remove.emit();
  }
}
