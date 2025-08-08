import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgendamentoForm } from '../../../interfaces/agendamento-form.interface';
import { AgendamentoService } from '../../../services/agendamento.service';

interface TimeTableRow {
  manha?: string;
  tarde?: string;
}

@Component({
  selector: 'app-horarios',
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent {

  selectedTime: string | null = null;
  @Input() horariosDisponiveis: string[] = [];
  @Output() timeSelected = new EventEmitter<string>();

  constructor(private agendamentoService: AgendamentoService) {}

  formatTime(time: string): string {
    // Converter "10:30:00" para "10:30"
    return time.substring(0, 5);
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    this.timeSelected.emit(time);
    
  }

  getTimeTableRows(): TimeTableRow[] {
    const rows: TimeTableRow[] = [];
    const manhaTimes = this.horariosDisponiveis.filter(time => {
      const hour = parseInt(time.split(':')[0]);
      return hour < 13;
    });
    
    const tardeTimes = this.horariosDisponiveis.filter(time => {
      const hour = parseInt(time.split(':')[0]);
      return hour >= 13;
    });

    const maxLength = Math.max(manhaTimes.length, tardeTimes.length);
    
    for (let i = 0; i < maxLength; i++) {
      rows.push({
        manha: manhaTimes[i] || undefined,
        tarde: tardeTimes[i] || undefined
      });
    }
    
    return rows;
  }
}
