import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  @Output() public clickOutside = new EventEmitter<void>();

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event.target'])
  public onDocumentClick(target: HTMLElement): void {
    if (!this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
