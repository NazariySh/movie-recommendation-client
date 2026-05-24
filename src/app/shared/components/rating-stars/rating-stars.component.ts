import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class RatingStarsComponent {
  @Input() public value: number | null = null;
  @Input({ transform: numberAttribute }) public max = 5;
  @Input({ transform: numberAttribute }) public scale = 10;
  @Input({ transform: booleanAttribute }) public readonly = false;
  @Input({ transform: booleanAttribute }) public disabled = false;
  @Input({ transform: booleanAttribute }) public showNumbers = true;
  @Input() public ariaLabel = 'Rating';

  @Output() public readonly valueChange = new EventEmitter<number>();

  public hoverIndex: number | null = null;

  public get stars(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  public get unitPerStar(): number {
    return this.scale / this.max;
  }

  public get filledCount(): number {
    if (this.hoverIndex !== null) {
      return this.hoverIndex;
    }
    if (this.value === null || this.value === undefined) {
      return 0;
    }
    return Math.ceil(this.value / this.unitPerStar);
  }

  public isFilled(starIndex: number): boolean {
    return starIndex <= this.filledCount;
  }

  public isInteractive(): boolean {
    return !this.readonly && !this.disabled;
  }

  public onStarClick(starIndex: number): void {
    if (!this.isInteractive()) {
      return;
    }
    this.valueChange.emit(starIndex * this.unitPerStar);
  }

  public onStarEnter(starIndex: number): void {
    if (!this.isInteractive()) {
      return;
    }
    this.hoverIndex = starIndex;
  }

  public onStarLeave(): void {
    this.hoverIndex = null;
  }
}
