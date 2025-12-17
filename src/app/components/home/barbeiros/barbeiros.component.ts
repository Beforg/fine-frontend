import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Barbeiro } from '../../../interfaces/entities.interface';
import { BarbeiroService } from '../../../services/barbeiro.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-barbeiros',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
    LoadingComponent,
  ],
  templateUrl: './barbeiros.component.html',
  styleUrl: './barbeiros.component.scss',
})
export class BarbeirosComponent implements OnInit {
  barbeiros!: Barbeiro[];
  isLoading: boolean = true;

  constructor(
    private barbeiroService: BarbeiroService,
  ) {
  }

  ngOnInit(): void {
    this.barbeiroService.getBarbeiros().subscribe({
      next: (barbeiros) => {
        this.barbeiros = barbeiros.filter((barbeiro) => barbeiro.ativo);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar barbeiros:', err);
        this.isLoading = false;
      },
    });
  }
}
