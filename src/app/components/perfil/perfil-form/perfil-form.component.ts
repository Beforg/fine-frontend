import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { UserInfo } from '../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from "../../primary-button/primary-button.component";
import { InputFieldComponent } from "../../input-field/input-field.component";

@Component({
  selector: 'app-perfil-form',
  imports: [MatInputModule, MatCardModule, MatIconModule, CommonModule, PrimaryButtonComponent, InputFieldComponent],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss'
})
export class PerfilFormComponent {
  @Input() userInfo: UserInfo | null = null;
  @Input() userRole: string = '';
  @Input() userEmail: string = '';
  @Output() editProfile = new EventEmitter<void>();
  showEditModal: boolean = false;
  

  onEditProfile() {
    this.editProfile.emit();
  }

  onSaveChanges() {

  }

  abrirModalEdicao() {
    this.showEditModal = true;
  }

  fecharModalEdicao() {
    this.showEditModal = false;
  }
}
