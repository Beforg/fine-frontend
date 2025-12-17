import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input()barbeiros: Barbeiro[] = [];
  @Output() barbeirosChange = new EventEmitter<Barbeiro[]>();
  // Modal/Formulário
  showModal: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = true;
  currentBarbeiro: Barbeiro = this.getEmptyBarbeiro();
  // Para carregar dados
  
  //arquivos para enviar
  selectedFotoFile: File | null = null;
  selectedBackgroundFile: File | null = null;
  // URLs de preview
  previewFotoUrl: string | null = null;
  previewBackgroundUrl: string | null = null;
  
  // Campos adicionais para cadastro
  cadastroEmail: string = '';
  cadastroSenha: string = '';
  cadastroConfirmarSenha: string = '';
  cadastroEspecialidade: string = '';
  cadastroBio: string = '';
  
  // Controle de telefone
  selectedCountry: string = '+55';
  countries = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+598', name: 'Uruguai', flag: '🇺🇾' }
  ];

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
      '09:00 - 12:00',
      '14:00 - 19:00',
      '09:30 - 19:00',
      '09:30 - 14:00',
      '09:30 - 12:00',

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
    //this.carregarBarbeiros();
  }

  handleBarbeirosChange() {
    this.barbeirosChange.emit(this.barbeiros);
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

  // carregarBarbeiros(): void {
  //   // Carregando barbeiros do backend
  //   this.barbeiroService.getBarbeiros().subscribe(barbeiros => {
  //     if (!this.isAdmin()) {
  //       this.barbeiros = barbeiros.filter(b => b.nome == this.authService.getCurrentUser().name);
  //     } else {
  //       this.barbeiros = barbeiros;
  //     }
    
  //   });
  // }

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
      // Upload das imagens se foram selecionadas (assíncrono)
      const uploadPromises: Promise<void>[] = [];

      if (this.selectedFotoFile) {
        const fotoPromise = new Promise<void>((resolve, reject) => {
          this.imageService.uploadBarbeiroPhoto(this.selectedFotoFile!, this.currentBarbeiro.barbeiroId, false)
            .subscribe({
              next: (url) => {
                this.currentBarbeiro.urlFoto = url;
                console.log('✅ Foto de perfil atualizada:', url);
                resolve();
              },
              error: (err) => reject(err)
            });
        });
        uploadPromises.push(fotoPromise);
      }

      if (this.selectedBackgroundFile) {
        const bgPromise = new Promise<void>((resolve, reject) => {
          this.imageService.uploadBarbeiroPhoto(this.selectedBackgroundFile!, this.currentBarbeiro.barbeiroId, true)
            .subscribe({
              next: (url) => {
                this.currentBarbeiro.urlBackground = url;
                console.log('✅ Background atualizado:', url);
                resolve();
              },
              error: (err) => reject(err)
            });
        });
        uploadPromises.push(bgPromise);
      }

      // Aguarda todos os uploads terminarem
      Promise.all(uploadPromises).then(() => {
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
            this.handleBarbeirosChange();
            const isOwnProfile = !this.isAdmin();
            const successMessage = isOwnProfile 
              ? 'Seu perfil foi atualizado com sucesso!' 
              : `Barbeiro "${this.currentBarbeiro.nome}" editado com sucesso!`;
            this.notificationService.success(successMessage);
          } else {
            this.notificationService.error(response?.message || 'Erro ao atualizar barbeiro');
          }
          this.fecharModal();
        });
      }).catch(error => {
        console.error('❌ Erro no upload das imagens:', error);
        this.notificationService.error('Erro ao fazer upload das imagens');
        this.fecharModal();
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

      if (this.cadastroSenha.length < 6) {
        this.notificationService.validationError('Senha deve ter no mínimo 6 caracteres!');
        return;
      }

      if (this.cadastroSenha !== this.cadastroConfirmarSenha) {
        this.notificationService.validationError('As senhas não coincidem!');
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
    

      const novoBarbeiro: CadastroBarbeiro = {
        nome: this.currentBarbeiro.nome,
        telefone: this.selectedCountry + ' ' + this.currentBarbeiro.telefone,
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
          const barbeiroId = response.data?.barbeiroId;
          
          if (!barbeiroId) {
            this.notificationService.error('Erro: ID do barbeiro não retornado');
            this.fecharModal();
            return;
          }

          // Upload das imagens após criar o barbeiro
          const uploadPromises: Promise<void>[] = [];

          if (this.selectedFotoFile) {
            const fotoPromise = new Promise<void>((resolve, reject) => {
              this.imageService.uploadBarbeiroPhoto(this.selectedFotoFile!, barbeiroId, false)
                .subscribe({
                  next: (url) => {
                    console.log('✅ Foto de perfil salva:', url);
                    
                    // Atualizar barbeiro com a URL da foto
                    const barbeiroAtualizado: EditarBarbeiro = {
                      barbeiroId: barbeiroId,
                      nome: novoBarbeiro.nome,
                      telefone: novoBarbeiro.telefone,
                      especialidade: novoBarbeiro.especialidade,
                      bio: novoBarbeiro.bio,
                      urlFoto: url,
                      urlBackground: novoBarbeiro.urlBackground,
                      ativo: true,
                      horariosTrabalho: horariosTrabalho
                    };
                    
                    this.barbeiroService.editarBarbeiro(barbeiroAtualizado).subscribe(() => resolve());
                  },
                  error: (err) => reject(err)
                });
            });
            uploadPromises.push(fotoPromise);
          }

          if (this.selectedBackgroundFile) {
            const bgPromise = new Promise<void>((resolve, reject) => {
              this.imageService.uploadBarbeiroPhoto(this.selectedBackgroundFile!, barbeiroId, true)
                .subscribe({
                  next: (url) => {
                    console.log('✅ Background salvo:', url);
                    
                    // Atualizar barbeiro com a URL do background
                    const barbeiroAtualizado: EditarBarbeiro = {
                      barbeiroId: barbeiroId,
                      nome: novoBarbeiro.nome,
                      telefone: novoBarbeiro.telefone,
                      especialidade: novoBarbeiro.especialidade,
                      bio: novoBarbeiro.bio,
                      urlFoto: novoBarbeiro.urlFoto,
                      urlBackground: url,
                      ativo: true,
                      horariosTrabalho: horariosTrabalho
                    };
                    
                    this.barbeiroService.editarBarbeiro(barbeiroAtualizado).subscribe(() => resolve());
                  },
                  error: (err) => reject(err)
                });
            });
            uploadPromises.push(bgPromise);
          }

          // Aguarda uploads terminarem ou continua se não houver imagens
          Promise.all(uploadPromises).then(() => {
            this.handleBarbeirosChange();
            this.notificationService.success(`Barbeiro "${this.currentBarbeiro.nome}" cadastrado com sucesso!`);
            this.fecharModal();
          }).catch(error => {
            console.error('❌ Erro no upload das imagens:', error);
            this.notificationService.error('Barbeiro criado, mas erro ao fazer upload das imagens');
            this.fecharModal();
          });
        } else {
          this.notificationService.error(response?.message || 'Erro ao cadastrar barbeiro');
          this.fecharModal();
        }
      });
    }
  }

  editarBarbeiro(barbeiro: Barbeiro): void {
    console.log('Editando barbeiro:', barbeiro);
    this.abrirModal(barbeiro);
  }

  toggleStatus(barbeiro: Barbeiro): void {
    const novoStatus = !barbeiro.ativo;
    const statusTexto = novoStatus ? 'ativo' : 'inativo';
    
    // Buscar horários atuais do barbeiro
    this.barbeiroService.getHorariosTrabalhoBarbeiro(barbeiro.barbeiroId).subscribe({
      next: (horarios) => {
        const horariosTrabalho: HorarioTrabalhoDia[] = horarios.map(h => ({
          dia: h.dia,
          horaInicio: h.horaInicio,
          horaFim: h.horaFim
        }));

        const barbeiroEditado: EditarBarbeiro = {
          barbeiroId: barbeiro.barbeiroId,
          nome: barbeiro.nome,
          telefone: barbeiro.telefone,
          especialidade: barbeiro.especialidade,
          bio: barbeiro.bio,
          urlFoto: barbeiro.urlFoto,
          urlBackground: barbeiro.urlBackground,
          ativo: novoStatus,
          horariosTrabalho: horariosTrabalho
        };

        this.barbeiroService.editarBarbeiro(barbeiroEditado).subscribe({
          next: (response) => {
            if (response && (response.httpStatus === "OK" || response.httpStatus === "CREATED")) {
              barbeiro.ativo = novoStatus;
              this.notificationService.success(`Barbeiro "${barbeiro.nome}" marcado como ${statusTexto}!`);
              this.handleBarbeirosChange();
            } else {
              this.notificationService.error(response?.message || 'Erro ao alterar status do barbeiro');
            }
          },
          error: (err) => {
            console.error('Erro ao alterar status do barbeiro:', err);
            this.notificationService.error('Erro ao alterar status do barbeiro');
          }
        });
      },
      error: (err) => {
        console.error('Erro ao buscar horários do barbeiro:', err);
        this.notificationService.error('Erro ao buscar horários do barbeiro');
      }
    });
  }

  removerBarbeiro(barbeiroId: number): void {
    // const barbeiro = this.barbeiros.find(b => b.barbeiroId === barbeiroId);
    // if (!barbeiro) return;

    // const confirmacao = confirm(`Tem certeza que deseja remover o barbeiro "${barbeiro.nome}"?`);
    // if (confirmacao) {
    //   this.barbeiroService.excluirBarbeiro(barbeiroId).subscribe({next: (response) => {
    //       this.notificationService.success(`Barbeiro removido com sucesso!`);
    //       this.handleBarbeirosChange();
    //     },
    //     error: (err) => {
    //       console.error('Erro ao remover barbeiro:', err);
    //       this.notificationService.error(err.error?.message || 'Erro ao remover barbeiro');
    //     }
    //   });
    //   // Implementar chamada ao serviço para remover do backend
    // }
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

  // =============================================
  // MÉTODOS PARA TELEFONE
  // =============================================
  
  /**
   * Muda o país e limpa o campo de telefone
   */
  onCountryChange(): void {
    this.currentBarbeiro.telefone = '';
  }

  /**
   * Handler de input que aplica formatação de telefone
   */
  onTelefoneInput(value: string): void {
    const cleanValue = value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (this.selectedCountry === '+55') {
      // Formato Brasil: (11) 99999-9999 ou (11) 9999-9999
      if (cleanValue.length <= 2) {
        formattedValue = cleanValue;
      } else if (cleanValue.length <= 6) {
        formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
      } else if (cleanValue.length <= 10) {
        formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6)}`;
      } else {
        formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
      }
    } else if (this.selectedCountry === '+598') {
      // Formato Uruguai: 99 123 456 ou 9 1234 5678
      if (cleanValue.length <= 2) {
        formattedValue = cleanValue;
      } else if (cleanValue.length <= 5) {
        formattedValue = `${cleanValue.slice(0, 2)} ${cleanValue.slice(2)}`;
      } else if (cleanValue.length <= 7) {
        formattedValue = `${cleanValue.slice(0, 2)} ${cleanValue.slice(2, 5)} ${cleanValue.slice(5)}`;
      } else if (cleanValue.length <= 8) {
        formattedValue = `${cleanValue.slice(0, 1)} ${cleanValue.slice(1, 5)} ${cleanValue.slice(5)}`;
      } else {
        formattedValue = `${cleanValue.slice(0, 1)} ${cleanValue.slice(1, 5)} ${cleanValue.slice(5, 9)}`;
      }
    }
    
    if (formattedValue !== value) {
      this.currentBarbeiro.telefone = formattedValue;
    }
  }

  /**
   * Retorna o placeholder baseado no país
   */
  getTelefonePlaceholder(): string {
    return this.selectedCountry === '+55' 
      ? '(11) 99999-9999'
      : '99 123 456';
  }
}
