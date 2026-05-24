import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ButtonColor, ButtonColorInput, ButtonSize, ButtonSizeInput, ButtonType, ButtonTypeInput } from './button.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() public buttonType: ButtonTypeInput = ButtonType.Flat;
  @Input() public color: ButtonColorInput = ButtonColor.Primary;
  @Input() public type: 'button' | 'submit' | 'reset' = 'button';
  @Input() public disabled = false;
  @Input() public size: ButtonSizeInput = ButtonSize.Medium;

  @Output() public clicked = new EventEmitter<MouseEvent>();

  @HostBinding('attr.data-size')
  public get hostSize(): ButtonSizeInput {
    return this.size;
  }

  public get materialColor(): ThemePalette {
    return this.color === ButtonColor.None ? undefined : (this.color as ThemePalette);
  }

  public onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
