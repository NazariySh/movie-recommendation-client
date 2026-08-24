import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { SelectItem } from '../../../core/models/select-item';

export type SelectMode = 'single' | 'multi';
export type SelectValue = string | number | (string | number)[] | null;

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() public items: SelectItem[] = [];
  @Input() public mode: SelectMode = 'single';
  @Input() public placeholder = '';
  @Input({ transform: booleanAttribute }) public searchable = false;
  @Input() public searchPlaceholder = 'COMMON.SEARCH';
  @Input() public applyLabel = 'COMMON.APPLY';
  @Input() public resetLabel = 'COMMON.RESET';
  @Input() public emptyLabel = 'COMMON.NO_RESULTS';
  @Input({ transform: booleanAttribute }) public disabled = false;

  @Input()
  public set value(v: SelectValue) {
    this.writeValue(v);
  }

  @Output() public readonly valueChange = new EventEmitter<SelectValue>();

  public isOpen = false;
  public searchQuery = '';
  public stagedValues: ReadonlySet<unknown> = new Set();
  public triggerWidth = 0;

  public readonly panelPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  ];

  private singleValue: string | number | null = null;
  private multiValues: (string | number)[] = [];

  private onChange: (value: SelectValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public get triggerLabel(): string {
    if (this.mode === 'multi') {
      if (!this.multiValues.length) {
        return this.placeholder;
      }
      return this.multiValues
        .map((v) => this.items.find((i) => i.value === v)?.label ?? String(v))
        .join(', ');
    }

    return this.items.find((i) => i.value === this.singleValue)?.label ?? this.placeholder;
  }

  public get triggerIcon(): string | undefined {
    if (this.mode !== 'single') {
      return undefined;
    }
    return this.items.find((i) => i.value === this.singleValue)?.icon;
  }

  public get hasValue(): boolean {
    return this.mode === 'multi'
      ? this.multiValues.length > 0
      : this.singleValue !== null && this.singleValue !== undefined;
  }

  public get filteredItems(): SelectItem[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return this.items;
    }
    return this.items.filter((i) => i.label.toLowerCase().includes(q));
  }

  public isStaged(value: unknown): boolean {
    return this.stagedValues.has(value);
  }

  public isActive(value: unknown): boolean {
    return this.singleValue === value;
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    if (this.disabled || this.isOpen) {
      return;
    }
    this.isOpen = true;
    this.searchQuery = '';

    if (this.mode === 'multi') {
      this.stagedValues = new Set(this.multiValues);
    }

    const triggerEl = this.host.nativeElement.querySelector('.app-select__trigger');
    if (triggerEl) {
      this.triggerWidth = triggerEl.getBoundingClientRect().width;
    }

    this.cdr.markForCheck();
  }

  public close(): void {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.onTouched();
    this.cdr.markForCheck();
  }

  public onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  public selectSingle(item: SelectItem): void {
    if (item.disabled) {
      return;
    }
    this.singleValue = item.value;
    this.emit(item.value);
    this.close();
  }

  public toggleStaged(item: SelectItem): void {
    if (item.disabled) {
      return;
    }
    const next = new Set(this.stagedValues);
    if (next.has(item.value)) {
      next.delete(item.value);
    } else {
      next.add(item.value);
    }
    this.stagedValues = next;
    this.cdr.markForCheck();
  }

  public applyStaged(): void {
    const next = Array.from(this.stagedValues) as (string | number)[];
    this.multiValues = next;
    this.emit(next);
    this.close();
  }

  public resetStaged(): void {
    this.stagedValues = new Set();
    this.cdr.markForCheck();
  }

  public writeValue(value: SelectValue): void {
    if (this.mode === 'multi') {
      this.multiValues = Array.isArray(value) ? [...value] : [];
    } else {
      this.singleValue = Array.isArray(value) ? null : value;
    }
    this.cdr.markForCheck();
  }

  public registerOnChange(fn: (v: SelectValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  private emit(value: SelectValue): void {
    this.onChange(value);
    this.valueChange.emit(value);
  }
}
