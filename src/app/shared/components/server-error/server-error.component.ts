import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {
  public readonly message: string;

  constructor(private readonly translate: TranslateService) {
    this.message = history.state?.message ?? this.translate.instant('ERRORS.SERVER_ERROR_MESSAGE');
  }
}
