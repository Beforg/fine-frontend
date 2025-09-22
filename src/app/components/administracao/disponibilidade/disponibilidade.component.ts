import { Component } from '@angular/core';
import { Indisponibilidade } from '../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-disponibilidade',
  imports: [CommonModule, MatIconModule],
  templateUrl: './disponibilidade.component.html',
  styleUrl: './disponibilidade.component.scss'
})
export class DisponibilidadeComponent {
  indisponibilidades: Indisponibilidade[] = [
    {
      barbeiroId: 1,
      barbeiroNome: "João Silva",
      data: new Date('2024-07-01'),
      horaInicio: "09:00",
      horaFim: "18:00",
      motivo: "Férias anuais"
    },
  
  ];

}
