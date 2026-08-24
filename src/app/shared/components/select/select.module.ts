import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { SelectComponent } from './select.component';

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, FormsModule, OverlayModule, MatIconModule, TranslateModule],
  exports: [SelectComponent],
})
export class SelectModule {}
