import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatIconModule, LanguageSwitcherComponent],
})
export class FooterComponent {
  public readonly currentYear = new Date().getFullYear();
}
