import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Barbeiro, CadastroBarbeiro, EditarBarbeiro, HorarioTrabalhoDia } from '../../../interfaces/entities.interface';
import { BarbeiroService } from '../../../services/barbeiro.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { UserRole } from '../../../enums/user-role.enum';
import { ImageService } from '../../../services/image.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-barbeiros-gerenciamento',
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './barbeiros.component.html',
  styleUrl: './barbeiros.component.scss'
})
export class BarbeirosComponent implements OnInit {
  barbeiros: Barbeiro[] = [];
  // Modal/Formulário
  showModal: boolean = false;
  isEditing: boolean = false;
  currentBarbeiro: Barbeiro = this.getEmptyBarbeiro();
  //arquivos para enviar
  selectedFotoFile: File | null = null;
  selectedBackgroundFile: File | null = null;
  // URLs de preview
  previewFotoUrl: string | null = null;
  previewBackgroundUrl: string | null = null;
  
  // Campos adicionais para cadastro
  cadastroEmail: string = '';
  cadastroSenha: string = '';
  cadastroEspecialidade: string = '';
  cadastroBio: string = '';

  // Horarios do barbeiro:
 diasDaSemana: {key: string, label: string}[] = [
    { key: '1', label: 'Segunda-feira' },
    { key: '2', label: 'Terça-feira' },
    { key: '3', label: 'Quarta-feira' },
    { key: '4', label: 'Quinta-feira' },
    { key: '5', label: 'Sexta-feira' },
    { key: '6', label: 'Sábado' },
  ];
  horariosDeTrabalho: string[] = [
      '09:00 - 19:00',
      '09:00 - 14:00',
      '14:00 - 19:00',

  ];

  horariosPorDia: { [key: string]: string } = {
    '1': '09:00 - 19:00', // Padrão: "Não trabalha"
    '2': '09:00 - 19:00',
    '3': '09:00 - 19:00',
    '4': '09:00 - 19:00',
    '5': '09:00 - 19:00',
    '6': '09:30 - 19:00',
  };


  constructor(
    private barbeiroService: BarbeiroService, 
    private authService: AuthService,
    private notificationService: NotificationService,
    private imageService: ImageService
  ) {
    
  }

  ngOnInit(): void {
    this.carregarBarbeiros();
  }

  getEmptyBarbeiro(): Barbeiro {
    return {
      barbeiroId: 0,
      nome: '',
      telefone: '',
      visualizacoes: 0,
      cortesRealizados: 0,
      urlFoto: '',
      urlBackground: '',
      bio: '',
      especialidade: '',
      ativo: true
    };
  }

  carregarHorariosBarbeiro(barbeiroId: number): void {
    this.barbeiroService.getHorariosTrabalhoBarbeiro(barbeiroId).subscribe(horarios => {
       this.horariosPorDia = horarios.reduce((acc: { [key: string]: string }, curr) => {
          const horaInicio = curr.horaInicio.slice(0, 5);
          const horaFim = curr.horaFim.slice(0, 5);
          acc[curr.dia.toString()] = `${horaInicio} - ${horaFim}`;
          return acc;
       }, {});
       console.log("Horários carregados para o barbeiro:", this.horariosPorDia); 
    });
  }

  carregarBarbeiros(): void {
    // Carregando barbeiros do backend
    this.barbeiroService.getBarbeiros().subscribe(barbeiros => {
      if (!this.isAdmin()) {
        this.barbeiros = barbeiros.filter(b => b.nome == this.authService.getCurrentUser().name);
      } else {
        this.barbeiros = barbeiros;
      }
    
    });
  }

  isAdmin(): boolean {
    if (this.authService.isAuthenticated()) {
      return this.authService.getCurrentUser().role === UserRole.ADMIN;
    }
    return false;
  }
  // =============================================
  // MODAL E FORMULÁRIO
  // =============================================
  abrirModal(barbeiro?: Barbeiro): void {
    this.showModal = true;
    this.carregarHorariosBarbeiro(barbeiro!.barbeiroId);
    if (barbeiro) {
      this.isEditing = true;
      this.currentBarbeiro = { ...barbeiro }; // Copia para não alterar o original
      // Definir previews com as URLs existentes
      this.previewFotoUrl = barbeiro.urlFoto || null;
      this.previewBackgroundUrl = barbeiro.urlBackground || null;
    } else {
      this.isEditing = false;
      this.currentBarbeiro = this.getEmptyBarbeiro();
      // Limpar campos de cadastro
      this.cadastroEmail = '';
      this.cadastroSenha = '';
      this.cadastroEspecialidade = '';
      this.cadastroBio = '';
      // Limpar previews
      this.previewFotoUrl = null;
      this.previewBackgroundUrl = null;
    }
    
    // Limpar arquivos selecionados
    this.selectedFotoFile = null;
    this.selectedBackgroundFile = null;
  }

  fecharModal(): void {
    this.showModal = false;
    this.currentBarbeiro = this.getEmptyBarbeiro();
    this.isEditing = false;
    // Limpar campos de cadastro
    this.cadastroEmail = '';
    this.cadastroSenha = '';
    this.cadastroEspecialidade = '';
    this.cadastroBio = '';
    // Limpar uploads e previews
    this.selectedFotoFile = null;
    this.selectedBackgroundFile = null;
    this.previewFotoUrl = null;
    this.previewBackgroundUrl = null;
    console.log(this.horariosPorDia);
    
  }

  salvarBarbeiro(): void {
    // Validações básicas
    if (!this.currentBarbeiro.nome.trim()) {
      this.notificationService.validationError('Nome do barbeiro é obrigatório!');
      return;
    }

    if (!this.currentBarbeiro.telefone.trim()) {
      this.notificationService.validationError('Telefone é obrigatório!');
      return;
    }

    let horariosTrabalho: HorarioTrabalhoDia[] = [];
      for (const diaKey in this.horariosPorDia) {
        const horario = this.horariosPorDia[diaKey];
        const [horaInicio, horaFim] = horario.split(' - ');
        horariosTrabalho.push({
          dia: parseInt(diaKey),
          horaInicio: `${horaInicio}:00`,
          horaFim: `${horaFim}:00`
        })
      }

    if (this.isEditing) {
      // Upload das imagens se foram selecionadas
      if (this.selectedFotoFile) {
        const fotoUrl = this.imageService.uploadBarbeiroPhoto(this.selectedFotoFile, this.currentBarbeiro.barbeiroId, false);
        this.currentBarbeiro.urlFoto = fotoUrl;
      }

      if (this.selectedBackgroundFile) {
        const backgroundUrl = this.imageService.uploadBarbeiroPhoto(this.selectedBackgroundFile, this.currentBarbeiro.barbeiroId, true);
        this.currentBarbeiro.urlBackground = backgroundUrl;
      }

      // Editar barbeiro existente
      const barbeiroEditado: EditarBarbeiro =  {
        barbeiroId: this.currentBarbeiro.barbeiroId,
        nome: this.currentBarbeiro.nome,
        telefone: this.currentBarbeiro.telefone,
        especialidade: this.currentBarbeiro.especialidade,
        bio: this.currentBarbeiro.bio,
        urlFoto: this.currentBarbeiro.urlFoto,
        urlBackground: this.currentBarbeiro.urlBackground,
        ativo: this.currentBarbeiro.ativo,
        horariosTrabalho: horariosTrabalho
      }
      this.barbeiroService.editarBarbeiro(barbeiroEditado).subscribe(response => {
        if (response && (response.httpStatus === "OK" || response.httpStatus === "CREATED")) {
          this.carregarBarbeiros();
          const isOwnProfile = !this.isAdmin();
          const successMessage = isOwnProfile 
            ? 'Seu perfil foi atualizado com sucesso!' 
            : `Barbeiro "${this.currentBarbeiro.nome}" editado com sucesso!`;
          this.notificationService.success(successMessage);
        } else {
          this.notificationService.error(response?.message || 'Erro ao atualizar barbeiro');
        }
      });
    } else {
      // Validações adicionais para cadastro
      if (!this.cadastroEmail.trim()) {
        this.notificationService.validationError('Email é obrigatório!');
        return;
      }

      if (!this.cadastroSenha.trim()) {
        this.notificationService.validationError('Senha é obrigatória!');
        return;
      }

      if (!this.cadastroEspecialidade.trim()) {
        this.notificationService.validationError('Especialidade é obrigatória!');
        return;
      }

      if (!this.cadastroBio.trim()) {
        this.notificationService.validationError('Bio é obrigatória!');
        return;
      }

      // Adicionar novo barbeiro usando CadastroBarbeiro
      // let horariosTrabalho: HorarioTrabalhoDia[] = [];
      // for (const diaKey in this.horariosPorDia) {
      //   const horario = this.horariosPorDia[diaKey];
      //   const [horaInicio, horaFim] = horario.split(' - ');
      //   horariosTrabalho.push({
      //     dia: parseInt(diaKey),
      //     horaInicio: `${horaInicio}:00`,
      //     horaFim: `${horaFim}:00`
      //   })
      // }

      

      const novoBarbeiro: CadastroBarbeiro = {
        nome: this.currentBarbeiro.nome,
        telefone: this.currentBarbeiro.telefone,
        email: this.cadastroEmail,
        senha: this.cadastroSenha,
        especialidade: this.cadastroEspecialidade,
        bio: this.cadastroBio,
        urlFoto: this.currentBarbeiro.urlFoto || '',
        urlBackground: this.currentBarbeiro.urlBackground || '',
        horariosTrabalho: horariosTrabalho
      };
      console.log(novoBarbeiro);
      this.barbeiroService.cadastrarBarbeiro(novoBarbeiro).subscribe(response => {
        if (response && (response.httpStatus === "CREATED" || response.httpStatus === "OK")) {
          this.carregarBarbeiros();
          
          // Fazer upload das imagens após criar o barbeiro
          if (this.selectedFotoFile && response.data?.barbeiroId) {
            const fotoUrl = this.imageService.uploadBarbeiroPhoto(this.selectedFotoFile, response.data.barbeiroId, false);
            // Atualizar URL da foto no barbeiro criado
            const barbeiroAtualizado: EditarBarbeiro = {
              barbeiroId: response.data.barbeiroId,
              nome: novoBarbeiro.nome,
              telefone: novoBarbeiro.telefone,
              especialidade: novoBarbeiro.especialidade,
              bio: novoBarbeiro.bio,
              urlFoto: fotoUrl,
              urlBackground: novoBarbeiro.urlBackground,
              ativo: true,
              horariosTrabalho: horariosTrabalho
            };
            this.barbeiroService.editarBarbeiro(barbeiroAtualizado).subscribe();
          }

          if (this.selectedBackgroundFile && response.data?.barbeiroId) {
            const backgroundUrl = this.imageService.uploadBarbeiroPhoto(this.selectedBackgroundFile, response.data.barbeiroId, true);
            // Atualizar URL do background no barbeiro criado
            const barbeiroAtualizado: EditarBarbeiro = {
              barbeiroId: response.data.barbeiroId,
              nome: novoBarbeiro.nome,
              telefone: novoBarbeiro.telefone,
              especialidade: novoBarbeiro.especialidade,
              bio: novoBarbeiro.bio,
              urlFoto: novoBarbeiro.urlFoto,
              urlBackground: backgroundUrl,
              ativo: true,
              horariosTrabalho: horariosTrabalho
            };
            this.barbeiroService.editarBarbeiro(barbeiroAtualizado).subscribe();
          }
          
          this.notificationService.success(`Barbeiro "${this.currentBarbeiro.nome}" cadastrado com sucesso!`);
        } else {
          this.notificationService.error(response?.message || 'Erro ao cadastrar barbeiro');
        }
      });
    }

    this.fecharModal();
  }

  editarBarbeiro(barbeiro: Barbeiro): void {
    console.log('Editando barbeiro:', barbeiro);
    this.abrirModal(barbeiro);
  }

  removerBarbeiro(barbeiroId: number): void {
    const barbeiro = this.barbeiros.find(b => b.barbeiroId === barbeiroId);
    if (!barbeiro) return;

    const confirmacao = confirm(`Tem certeza que deseja remover o barbeiro "${barbeiro.nome}"?`);
    if (confirmacao) {
      this.barbeiros = this.barbeiros.filter(b => b.barbeiroId !== barbeiroId);
      console.log('Barbeiro removido:', barbeiroId);
      // Implementar chamada ao serviço para remover do backend
    }
  }

  adicionarBarbeiro(): void {
    console.log('Adicionando novo barbeiro');
    this.abrirModal();
  }

  // =============================================
  // MÉTODOS DE UPLOAD DE IMAGEM
  // =============================================
  
  // Método para selecionar foto do perfil
  onFotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validation = this.imageService.validateImageFile(file, 5);
      if (!validation.valid) {
        this.notificationService.validationError(validation.error!);
        return;
      }

      this.selectedFotoFile = file;
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewFotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para selecionar foto de background
  onBackgroundSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validation = this.imageService.validateImageFile(file, 10);
      if (!validation.valid) {
        this.notificationService.validationError(validation.error!);
        return;
      }

      this.selectedBackgroundFile = file;
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewBackgroundUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para remover foto do perfil
  removerFoto(): void {
    this.selectedFotoFile = null;
    this.previewFotoUrl = null;
    this.currentBarbeiro.urlFoto = '';
    
    // Limpar input
    const fotoInput = document.getElementById('fotoInput') as HTMLInputElement;
    if (fotoInput) fotoInput.value = '';
  }

  // Método para remover foto de background
  removerBackground(): void {
    this.selectedBackgroundFile = null;
    this.previewBackgroundUrl = null;
    this.currentBarbeiro.urlBackground = '';
    
    // Limpar input
    const backgroundInput = document.getElementById('backgroundInput') as HTMLInputElement;
    if (backgroundInput) backgroundInput.value = '';
  }

  // Métodos para abrir inputs de arquivo
  abrirSeletorFoto(): void {
    const fotoInput = document.getElementById('fotoInput') as HTMLInputElement;
    if (fotoInput) fotoInput.click();
  }

  abrirSeletorBackground(): void {
    const backgroundInput = document.getElementById('backgroundInput') as HTMLInputElement;
    if (backgroundInput) backgroundInput.click();
  }

  cleanUploads(): void {
    this.selectedFotoFile = null;
    this.selectedBackgroundFile = null;
  }

  onPhotoSelected(event: any): void {

  }
}
