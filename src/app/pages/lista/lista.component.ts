import { Component, OnInit } from '@angular/core';
import { Time } from "../../shared/models/time";
import { StorageService } from "../../shared/services/storage.service";
import { Jogador } from "../../shared/models/jogador";
import { Router } from "@angular/router";


@Component({
    selector: 'app-lista',
    templateUrl: './lista.component.html',
    styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

    times: Time[] = [];
    congelarTimeTela: boolean = null;
    showModal: boolean = false;
    jogadorEdit: any = null;
    numeroJogador: number | null = null;
    mostrarMensagem = false;
    constructor(
        private storage: StorageService,
        private router: Router,
    ) {
    }
    ngOnInit(): void {
        this.congelarTimeTela = this.storage.obterLocalStorage();
        this.numeroJogador = this.storage.buscarNumeroJogador();
        this.fazerTimes();
    }

    congelarTime() {
        const dado = this.storage.obterLocalStorage();
        if (dado === false) {
            this.congelarTimeTela = true;
        } else {
            this.congelarTimeTela = false;
        }
        var stringBooleana = JSON.stringify(this.congelarTimeTela);
        localStorage.setItem('congelarTimeTela', stringBooleana);
    }

    fazerTimes(): void {  
        const listaJogadores: Jogador[] = this.storage.obter();
        if (listaJogadores.length > 0) {
            this.times.push(new Time());
            for (const jogador of listaJogadores) {
                if (!this.times[this.times.length - 1].temVaga(this.numeroJogador)) {
                    this.times.push(new Time());
                }
                this.times[this.times.length - 1].jogadores.push(jogador);
            }
        }
    }

    removerJogador(id: string): void {
        this.storage.removerJogador(id);
        this.times = [];
        this.fazerTimes();
        if (this.times.length > 2 && this.times[3].jogadores.length < 4) {
            this.congelarTimeTela = false;
            var stringBooleana = JSON.stringify(this.congelarTimeTela);
            localStorage.setItem('congelarTimeTela', stringBooleana);
        }
    }

    timePerdedor(jogadores: Jogador[]) {
        const lista: Jogador[] = this.storage.obter();
        const idsPerdedores = new Set(jogadores.map(j => j.id));
      
        // Soma vitória apenas para os jogadores do time vencedor (times[1] se times[0] perdeu, e vice-versa)
        const timeVencedor = this.times[0].jogadores.some(j => idsPerdedores.has(j.id))
          ? this.times[1]  // times[0] perdeu → times[1] ganhou
          : this.times[0]; // times[1] perdeu → times[0] ganhou
      
        const idsVencedores = new Set(timeVencedor.jogadores.map(j => j.id));
      
        for (const jogador of lista) {
          if (idsVencedores.has(jogador.id)) {
            jogador.vitorias += 1;
          }
        }
      
        // Reorganiza: perdedores vão pro final da fila
        const perdedores = lista.filter(j => idsPerdedores.has(j.id));
        const restante = lista.filter(j => !idsPerdedores.has(j.id));
        const novaLista = [...restante, ...perdedores];
      
        this.storage.salvarLista(novaLista);
        this.times = [];
        this.fazerTimes();
      }

    editarJogador(jogador: string) {
        if (jogador !== '' && jogador !== undefined) {
            this.showModal = false;
            const jogadorEditar: any = this.jogadorEdit;
            this.storage.editar(jogadorEditar, jogador);
        }else{
            this.mostrarMensagem = true;
        }
    }

    abrirModal(jogador: any) {
        this.jogadorEdit = jogador;
        this.showModal = true;
    }

    limpar(): void {
        this.storage.limpar();
        this.router.navigate(['/adicionar']).catch();
    }
}
