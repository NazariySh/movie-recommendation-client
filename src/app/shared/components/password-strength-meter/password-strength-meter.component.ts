import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface StrengthRule {
  key: string;
  test: (p: string) => boolean;
}

@Component({
  selector: 'app-password-strength-meter',
  templateUrl: './password-strength-meter.component.html',
  styleUrl: './password-strength-meter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class PasswordStrengthMeterComponent implements OnChanges {
  @Input() public password = '';

  public score = 0;
  public level: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  public rules: { key: string; satisfied: boolean }[] = [];

  private readonly strengthRules: StrengthRule[] = [
    { key: 'AUTH.PWD_RULE.LENGTH', test: p => p.length >= 8 },
    { key: 'AUTH.PWD_RULE.UPPER', test: p => /[A-Z]/.test(p) },
    { key: 'AUTH.PWD_RULE.LOWER', test: p => /[a-z]/.test(p) },
    { key: 'AUTH.PWD_RULE.DIGIT', test: p => /\d/.test(p) },
    { key: 'AUTH.PWD_RULE.SPECIAL', test: p => /[^A-Za-z0-9]/.test(p) },
  ];

  public ngOnChanges(_: SimpleChanges): void {
    this.rules = this.strengthRules.map(r => ({ key: r.key, satisfied: r.test(this.password) }));
    this.score = this.rules.filter(r => r.satisfied).length;
    this.level = this.score <= 2 ? 'weak' : this.score === 3 ? 'medium' : this.score === 4 ? 'strong' : 'very-strong';
  }
}
