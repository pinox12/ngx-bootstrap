// tslint:disable:no-use-before-declare
import {
  ChangeDetectorRef, Directive, ElementRef, forwardRef, HostBinding, HostListener, Input, OnInit,
  Optional
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonRadioGroupDirective } from './button-radio-group.directive';

export const RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ButtonRadioDirective),
  multi: true
};

/**
 * Create radio buttons or groups of buttons.
 * A value of a selected button is bound to a variable specified via ngModel.
 */
@Directive({
  selector: '[btnRadio]',
  providers: [RADIO_CONTROL_VALUE_ACCESSOR]
})
export class ButtonRadioDirective implements ControlValueAccessor, OnInit {
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;
  private _value: any;

  /** Radio button value, will be set to `ngModel` */
  @Input() btnRadio: any;
  /** If `true` — radio button can be unchecked */
  @Input() uncheckable: boolean;
  /** Current value of radio component or group */
  @Input() get value(): any {
    return this.group ? this.group.value : this._value;
  }

  set value(value: any) {
    if (this.group) {
      this.group.value = value;

      return;
    }
    this._value = value;
  }

  @HostBinding('class.active')
  get isActive(): boolean {
    return this.btnRadio === this.value;
  }

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    @Optional() private group: ButtonRadioGroupDirective
  ) {}

  @HostListener('click')
  onClick(): void {
    if (this.el.nativeElement.attributes.disabled || !this.uncheckable && this.btnRadio === this.value) {
      return;
    }

    this.value = this.uncheckable && this.btnRadio === this.value ? undefined : this.btnRadio;

    if (this.group) {
      this.group.onTouched();
      this.group.onChange(this.value);

      return;
    }
    this.onTouched();
    this.onChange(this.value);
  }

  ngOnInit(): void {
    this.uncheckable = typeof this.uncheckable !== 'undefined';
  }

  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor
  // model -> view
  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
