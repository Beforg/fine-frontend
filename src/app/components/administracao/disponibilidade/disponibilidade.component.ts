import { Component, Input, OnInit } from '@angular/core';
import { Indisponibilidade, Barbeiro, RegistroIndisponibilidade } from '../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IndisponibilidadeService } from '../../../services/indisponibilidade.service';

@Component({
  selector: 'app-disponibilidade',
  imports: [
    CommonModule, 
    MatIconModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './disponibilidade.component.html',
  styleUrl: './disponibilidade.component.scss'
})
export class DisponibilidadeComponent implements OnInit {
  indisponibilidades: Indisponibilidade[] = [];
  isModalOpen: boolean = false;
  bloqueioForm!: FormGroup;
  
  // Dados para os selects
  @Input() barbeiros!: Barbeiro[];
  // 
  horariosDisponiveis: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  constructor(private fb: FormBuilder, private indisponibilidadeService: IndisponibilidadeService) {}

  ngOnInit() {
    this.initializeForm();
    this.carregarIndisponibilidades();
  }

  carregarIndisponibilidades() {
    this.indisponibilidadeService.listarIndisponibilidades().subscribe({
      next: (data) => {
        this.indisponibilidades = data;
      },
      error: (error) => {
        console.error('Erro ao carregar indisponibilidades:', error);
      }
    });
  }

  initializeForm() {
    this.bloqueioForm = this.fb.group({
      data: ['', [Validators.required, this.dataFuturaValidator]],
      horaInicio: ['', Validators.required],
      horaFim: ['19:00', Validators.required],
      tipoBloqueio: ['barbeiro', Validators.required],
      barbeiroId: [''],
      motivo: ['', Validators.required]
    });

    // Observar mudanças no tipo de bloqueio
    this.bloqueioForm.get('tipoBloqueio')?.valueChanges.subscribe(tipo => {
      const barbeiroControl = this.bloqueioForm.get('barbeiroId');
      if (tipo === 'barbeiro') {
        barbeiroControl?.setValidators([Validators.required]);
      } else {
        barbeiroControl?.clearValidators();
        barbeiroControl?.setValue('');
      }
      barbeiroControl?.updateValueAndValidity();
    });

    // Observar mudanças na data para definir hora inicial padrão
    this.bloqueioForm.get('data')?.valueChanges.subscribe(data => {
      if (data) {
        const dataSelecionada = new Date(data);
        const diaSemana = dataSelecionada.getDay(); // 0 = Domingo, 6 = Sábado
        
        if (diaSemana === 6) { // Sábado
          this.bloqueioForm.get('horaInicio')?.setValue('09:30');
        } else { // Dias de semana
          this.bloqueioForm.get('horaInicio')?.setValue('09:00');
        }
      }
    });
  }

  // Validador customizado para data futura
  dataFuturaValidator(control: any) {
    if (!control.value) return null;
    
    const dataInformada = new Date(control.value);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return dataInformada >= hoje ? null : { dataPassada: true };
  }

  // Getter para facilitar acesso aos controles do form
  get f() { return this.bloqueioForm.controls; }

  // Método para obter a data de hoje no formato YYYY-MM-DD
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  openModal() {
    this.isModalOpen = true;
    this.initializeForm(); // Reinicializar o form ao abrir
  }

  closeModal() {
    this.isModalOpen = false;
    this.bloqueioForm.reset();
  }

  onSubmit() {
    if (this.bloqueioForm.valid) {
      const formData = this.bloqueioForm.value;
      
      // Encontrar o nome do barbeiro se for bloqueio específico
      let barbeiroNome = '';
      if (formData.tipoBloqueio === 'barbeiro') {
        const barbeiro = this.barbeiros.find(b => b.barbeiroId === formData.barbeiroId);
        barbeiroNome = barbeiro?.nome || '';
        const novaIndisponibilidade: RegistroIndisponibilidade = {
          barbeiroId: formData.barbeiroId,
          data: formData.data,
          horaInicio: formData.horaInicio,
          horaFim: formData.horaFim,
          motivo: formData.motivo
        }
        this.indisponibilidadeService.registrarIndisponibilidade(novaIndisponibilidade).subscribe({
          next: (response) => {
            console.log('Indisponibilidade registrada com sucesso:', response);
            // Adiciona a nova indisponibilidade à lista exibida
            this.indisponibilidades.push(response);
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao registrar indisponibilidade:', error);
            // Aqui você pode adicionar uma notificação de erro para o usuário
          }
        });
      } else {
        const novaIndisponibilidade: RegistroIndisponibilidade[] = this.barbeiros.map(b => ({
          barbeiroId: b.barbeiroId,
          data: formData.data,
          horaInicio: formData.horaInicio,
          horaFim: formData.horaFim,
          motivo: formData.motivo
        }));
        this.indisponibilidadeService.registrarFeriado(novaIndisponibilidade).subscribe({
          next: (response) => {
            console.log('Indisponibilidade registrada com sucesso:', response);
            this.indisponibilidades.push(...response);
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao registrar indisponibilidade:', error);
          }
        });
      }
      this.closeModal();
    }
  }
}
