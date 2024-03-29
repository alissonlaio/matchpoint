import {Jogador} from "./jogador";
import {v4 as uuidv4} from 'uuid';
export class Time {
    id: string;
    jogadores: Jogador[];
    quatidade: number

    constructor(jogadores?: Jogador[]) {
        this.id = uuidv4();
        this.jogadores = jogadores ?? [];
    }

    temVaga(quatidade): boolean {
        return this.jogadores.length < quatidade;
    }
}
