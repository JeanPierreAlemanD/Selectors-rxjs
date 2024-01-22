import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectorPagesComponent } from './pages/selector-pages/selector-pages.component';
import { CountriesRoutingModule } from './countries-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        CountriesRoutingModule,
        ReactiveFormsModule,
        
    ],
    exports: [],
    declarations: [
      SelectorPagesComponent
    ],
})
export class CountriesModule { }
