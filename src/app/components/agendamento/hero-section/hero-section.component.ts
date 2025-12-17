import { Component, Input } from '@angular/core';
import { Barbeiro } from '../../../interfaces/entities.interface';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-hero-section-agendamento',
  imports: [MatIcon],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input() barbeiro: Barbeiro |  null = null;
}
