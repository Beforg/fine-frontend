import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-field',
  imports: [
    CommonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor {
  
  // Propriedades de entrada
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() readonly: boolean = false;
  
  // Eventos
  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();
  @Output() suffixIconClick = new EventEmitter<void>();
  
  // Controle interno do valor
  private _value: string = '';
  showPassword: boolean = false;
  
  // Funções de callback para ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  get value(): string {
    return this._value;
  }
  
  set value(val: string) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }
  
  // Implementação do ControlValueAccessor
  writeValue(value: string): void {
    this._value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  // Métodos de evento
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }
  
  onFocus(): void {
    this.focusEvent.emit();
  }
  
  onBlur(): void {
    this.onTouched();
    this.blurEvent.emit();
  }
  
  onSuffixIconClick(): void {
    if (this.type === 'password') {
      this.togglePasswordVisibility();
    } else {
      this.suffixIconClick.emit();
    }
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  getInputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }
  
  getSuffixIcon(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'visibility_off' : 'visibility';
    }
    return this.suffixIcon || '';
  }
}
