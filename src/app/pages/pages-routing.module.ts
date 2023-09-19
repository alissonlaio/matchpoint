import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from "./pages.component";
import {AdicionarComponent} from "./adicionar/adicionar.component";
import {ListaComponent} from "./lista/lista.component";

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: 'adicionar',
                component: AdicionarComponent
            },
            {
                path: 'listar',
                component: ListaComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
