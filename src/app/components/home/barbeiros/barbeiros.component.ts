import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Barbeiro } from '../../../interfaces/entities.interface';
import { BarbeiroService } from '../../../services/barbeiro.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-barbeiros',
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './barbeiros.component.html',
  styleUrl: './barbeiros.component.scss'
})
export class BarbeirosComponent {

  barbeiros!: Barbeiro[];


  constructor(private barbeiroService: BarbeiroService, private route: ActivatedRoute) {
    this.barbeiroService.getBarbeiros().subscribe(barbeiros => {
      this.barbeiros = barbeiros.filter(barbeiro => barbeiro.ativo);
    });

    console.log('BarbeirosComponent initialized', this.barbeiros);

  }

}
