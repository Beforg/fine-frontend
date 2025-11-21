import { Component, Input } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { UserInfo } from '../../../interfaces/entities.interface';

@Component({
  selector: 'app-barber-stats',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './barber-stats.component.html',
  styleUrl: './barber-stats.component.scss'
})
export class BarberStatsComponent {
  @Input() userInfo: UserInfo | null = null;
  @Input() isBarbeiro: boolean = false; // false por padrão
}
