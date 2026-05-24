import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() public threshold = 200;
  @Output() public scrolled = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;
  private sentinel: HTMLElement | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  public ngOnInit(): void {
    this.sentinel = document.createElement('div');
    this.sentinel.style.height = '1px';
    this.el.nativeElement.appendChild(this.sentinel);

    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.scrolled.emit();
        }
      },
      { rootMargin: `${this.threshold}px` }
    );
    this.observer.observe(this.sentinel);
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sentinel?.remove();
  }
}
