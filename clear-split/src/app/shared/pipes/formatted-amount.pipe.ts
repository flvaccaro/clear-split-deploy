import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedAmount',
  standalone: true,
})
export class FormattedAmountPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '';
    return '$' + value.toLocaleString('es-AR');
  }
}
