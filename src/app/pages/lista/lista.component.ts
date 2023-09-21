import {Component, OnInit} from '@angular/core';
import {Time} from "../../shared/models/time";
import {StorageService} from "../../shared/services/storage.service";
import {Jogador} from "../../shared/models/jogador";
import {Router} from "@angular/router";

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {

    times: Time[] = [];
    congelarTimeTela: boolean = false;

    constructor(
        private storage: StorageService,
        private router: Router
    ) {
    }
    ngOnInit(): void {
        this.fazerTimes();
    }

    congelarTime(){
        if (this.congelarTimeTela === true) {
            this.congelarTimeTela = false;
        } else {
            this.congelarTimeTela = true;
        }
    }

    fazerTimes(): void {
        const listaJogadores: Jogador[] = this.storage.obter();
        if (listaJogadores.length > 0) {
            this.times.push(new Time());
            for (const jogador of listaJogadores) {
                if (!this.times[this.times.length - 1].temVaga()) {
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
        this.congelarTime();
    }

    timePerdedor(jogadores: Jogador[]) {
        const lista: Jogador[] = this.storage.obter();
        for (const jogador of jogadores) {
            const index = lista.findIndex(i => i.id === jogador.id);
            if (index > -1) {
                lista.splice(index, 1);
                lista.push(jogador);
            }
        }
        this.storage.salvar(lista);
        this.times = [];
        this.fazerTimes();
    }

    limpar(): void {
        this.storage.limpar();
        this.router.navigate(['/adicionar']).catch();
    }
}
