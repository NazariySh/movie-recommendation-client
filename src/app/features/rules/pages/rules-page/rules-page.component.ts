import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rules-page',
  templateUrl: './rules-page.component.html',
  styleUrl: './rules-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesPageComponent {
  public readonly ruleKeys: readonly string[] = Array.from(
    { length: 13 },
    (_, i) => `RULES.ITEMS.${i + 1}`,
  );
}
