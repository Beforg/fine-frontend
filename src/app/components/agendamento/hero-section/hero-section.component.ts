import { Component, Input } from '@angular/core';
import { Barbeiro } from '../../../interfaces/entities.interface';

@Component({
  selector: 'app-hero-section-agendamento',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input() barbeiro: Barbeiro |  null = null;
}
