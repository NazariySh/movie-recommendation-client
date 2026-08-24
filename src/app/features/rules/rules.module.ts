import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { RulesRoutingModule } from './rules-routing.module';
import { RulesPageComponent } from './pages/rules-page/rules-page.component';

@NgModule({
  declarations: [RulesPageComponent],
  imports: [SharedModule, RulesRoutingModule],
})
export class RulesModule {}
