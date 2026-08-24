import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<mat-progress-spinner mode="indeterminate" [diameter]="diameter" />`,
  styles: [`
    :host { display: inline-flex; align-items: center; }
    mat-progress-spinner { --mdc-circular-progress-active-indicator-color: currentColor; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  @Input() diameter = 24;
}
