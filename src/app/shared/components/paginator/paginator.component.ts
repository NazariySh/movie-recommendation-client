import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppIcon } from '../../../core/constants/app-icons';

export interface PaginatorPageChange {
  pageNumber: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class PaginatorComponent implements OnChanges {
  @Input() public length = 0;
  @Input() public pageSize = 20;
  @Input() public pageNumber = 1;

  @Output() public pageChange = new EventEmitter<PaginatorPageChange>();

  public readonly AppIcon = AppIcon;
  public pages: (number | string)[] = [];
  public totalPages = 0;

  public ngOnChanges(): void {
    this.updatePagesMenu();
  }

  public updatePagesMenu(): void {
    this.totalPages = Math.ceil(this.length / this.pageSize);
    const pagesCount = this.totalPages;
    const currentPage = this.pageNumber;

    this.pages = [];

    if (pagesCount === 0) {
      return;
    }

    if (pagesCount <= 7) {
      for (let i = 1; i <= pagesCount; i++) {
        this.pages.push(i);
      }
    } else if (currentPage <= 4) {
      this.pages = [1, 2, 3, 4, 5, '...', pagesCount];
    } else if (currentPage >= pagesCount - 3) {
      this.pages = [1, '...', pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1, pagesCount];
    } else {
      this.pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pagesCount];
    }
  }

  public selectPage(page: number | string): void {
    if (typeof page === 'string') return;
    this.setPage(page);
  }

  public nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.setPage(this.pageNumber + 1);
    }
  }

  public previousPage(): void {
    if (this.pageNumber > 1) {
      this.setPage(this.pageNumber - 1);
    }
  }

  private setPage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.updatePagesMenu();
    this.pageChange.emit({
      pageNumber,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
