import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FidelidadeDTO } from '../../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-fidelidade',
  imports: [CommonModule, MatIconModule
  ],
  templateUrl: './modal-fidelidade.component.html',
  styleUrl: './modal-fidelidade.component.scss'
})
export class ModalFidelidadeComponent {
    @Input() isOpen: boolean = false;
    @Input() fidelidadeCliente: FidelidadeDTO | null = null;
    @Input() clienteNome: string = '';

    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    fecharModal() {
        this.closeModal.emit();
    }

    isValidDate(date: string | null | undefined): boolean {
        if (!date || date === 'Sem registro') {
            return false;
        }
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    }
}
