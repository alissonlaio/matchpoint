import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {ListaComponent} from './lista/lista.component';
import {AdicionarComponent} from './adicionar/adicionar.component';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {TableModule} from "primeng/table";


@NgModule({
    declarations: [
        PagesComponent,
        ListaComponent,
        AdicionarComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        CardModule,
        TableModule
    ]
})
export class PagesModule {
}
