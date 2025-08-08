import { Component, Input } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { UserInfo } from '../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-form',
  imports: [MatInputModule, MatCardModule, MatIconModule, CommonModule],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss'
})
export class PerfilFormComponent {
  @Input() userInfo: UserInfo | null = null;
  @Input() userRole: string = '';
  @Input() userEmail: string = '';
}
