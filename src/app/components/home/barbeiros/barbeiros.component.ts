import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Barbeiro } from '../../../interfaces/entities.interface';
import { BarbeiroService } from '../../../services/barbeiro.service';

@Component({
  selector: 'app-barbeiros',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './barbeiros.component.html',
  styleUrl: './barbeiros.component.scss'
})
export class BarbeirosComponent {
  barbeiros!: Barbeiro[];

  constructor(private barbeiroService: BarbeiroService) {
    this.barbeiroService.getBarbeiros().subscribe(barbeiros => {
      this.barbeiros = barbeiros;
    });

    console.log('BarbeirosComponent initialized', this.barbeiros);
  }
}
