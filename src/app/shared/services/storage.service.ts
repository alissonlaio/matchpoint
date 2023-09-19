import {Injectable} from '@angular/core';
import {Jogador} from "../models/jogador";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    salvar(lista: any[]): void {
        const dados: string = JSON.stringify(lista);
        localStorage.setItem('lista', dados);
    }

    obter(): Jogador[] {
        const storage = localStorage.getItem('lista');
        if (storage !== null) {
            const lista: any[] = JSON.parse(storage);
            return lista.map(i => (new Jogador(i.nome, i.id)));
        }
        return [];
    }

    removerJogador(id: string): void {
        const lista: Jogador[] = this.obter();
        const jogador = lista.findIndex(i => i.id === id);
        if (jogador > -1) {
            lista.splice(jogador, 1);
            this.salvar(lista);
        }
    }

    adicionarJogador(jogador: Jogador): void {
        const lista: Jogador[] = this.obter();
        lista.push(jogador);
        this.salvar(lista);
    }

    limpar(): void {
        localStorage.removeItem('lista');
    }
}
