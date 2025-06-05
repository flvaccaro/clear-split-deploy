import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    CardComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent, CardComponent]
})
export class SharedModule { }