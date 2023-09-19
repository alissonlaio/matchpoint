import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';

const config: ExtraOptions = {
    useHash: false,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
}

const routes: Routes = [
    {
        path: '',
        redirectTo: 'adicionar',
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, config)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
