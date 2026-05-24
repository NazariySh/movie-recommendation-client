import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [MatProgressSpinnerModule],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
