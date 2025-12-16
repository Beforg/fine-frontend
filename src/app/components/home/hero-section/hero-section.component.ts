import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";


@Component({
  selector: 'app-hero-section',
  imports: [MatIconModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
