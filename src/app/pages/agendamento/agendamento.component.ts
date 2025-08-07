import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AgendamentoService } from '../../services/agendamento.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeroSectionComponent } from "../../components/agendamento/hero-section/hero-section.component";

interface TimeTableRow {
  manha?: string;
  tarde?: string;
}

@Component({
  selector: 'app-agendamento',
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    HeroSectionComponent
],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent implements OnInit {
  barbeiroId: string | null = null;
  selectedTime: string | null = null;
  
  // Mock data baseado nos horários que você forneceu
  horariosDisponiveis: string[] = [
    "10:30:00",
    "11:00:00", 
    "11:30:00",
    "12:00:00",
    "12:30:00",
    "13:00:00",
    "13:30:00",
    "14:00:00",
    "14:30:00",
    "15:00:00",
    "15:30:00",
    "16:00:00",
    "16:30:00",
    "17:00:00",
    "17:30:00"
  ];

  constructor(private route: ActivatedRoute, private agendamentoService: AgendamentoService) {
    this.barbeiroId = this.route.snapshot.paramMap.get('barbeiroId');
  }

  ngOnInit(): void {
    // Pegar o ID dos query parameters se não estiver nos route params
    this.route.queryParams.subscribe(params => {
      if (params['barbeiroId']) {
        this.barbeiroId = params['barbeiroId'];
      }
    });
    
    console.log('Barbeiro ID:', this.barbeiroId);
  }

  formatTime(time: string): string {
    // Converter "10:30:00" para "10:30"
    return time.substring(0, 5);
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    console.log('Horário selecionado:', time);
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
