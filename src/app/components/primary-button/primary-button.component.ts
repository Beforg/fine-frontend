import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss'
})
export class PrimaryButtonComponent {
  @Input() text: string = 'Botão';
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'raised' | 'flat' | 'stroked' | 'basic' = 'raised';
  @Input() color: 'primary' | 'accent' | 'warn' | '' = 'primary';
  
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
