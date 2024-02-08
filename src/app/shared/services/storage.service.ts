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
        window.location.reload();
        return [];
    }

    obterLocalStorage(){
        const storage: any = localStorage.getItem('congelarTimeTela')
        if (storage !== null) {
            var dado: boolean = JSON.parse(storage);
            return dado;
        }
        return dado;
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

    editar(jogador: any, nome: string){
       var idProcurado = jogador.id;
       var novoValor = nome;
        const storage = localStorage.getItem('lista');
        if (storage !== null) {
            const lista: any[] = JSON.parse(storage);
            const dado = lista.find(objeto => objeto.id === idProcurado);
            var indiceObjeto = lista.findIndex(objeto => objeto.id === idProcurado);
            if (indiceObjeto !== -1) {
                lista[indiceObjeto].nome = novoValor;
                localStorage.setItem('lista', JSON.stringify(lista));
            }
        }
        this.obter();
        window.location.reload();
    }

    incluirNumeroJogadores(numero: any){
        localStorage.setItem('QuantidadeJogadores', JSON.stringify(numero));
    }

    buscarNumeroJogador(){
        const storage = localStorage.getItem('QuantidadeJogadores');
        console.log('storage', storage);
        this.obter();
        return storage;
    }

    limpar(): void {
        localStorage.removeItem('lista');
        localStorage.removeItem('congelarTimeTela')
    }
}
