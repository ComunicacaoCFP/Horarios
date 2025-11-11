import { Routes } from '@angular/router';
import { FiltroComponent } from './filtro/filtro.component';
import { FiltroProfComponent } from './filtro-prof/filtro-prof.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
    path: 'filtro',
    component: FiltroComponent
    },
    {
    path: 'prof',
    component: FiltroProfComponent
    },
    {
    path: 'home',
    component: HomeComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
];
