import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-politicas-termos',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './politicas-termos.component.html',
  styleUrl: './politicas-termos.component.scss'
})
export class PoliticasTermosComponent {

}
