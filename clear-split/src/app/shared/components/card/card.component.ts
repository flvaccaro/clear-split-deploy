import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  imports: [CommonModule],
})
export class CardComponent {
  /**
   * Permite enviar clases Tailwind extras para anchos, márgenes, posicionamiento…
   * p.ej: "w-full max-w-sm", "mt-6", etc.
   */
  @Input() extraClasses = '';
}
