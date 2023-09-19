import {v4 as uuidv4} from 'uuid';
export class Jogador {
    id: string;
    nome: string;

    constructor(nome: string, id?: string) {
        this.nome = nome;
        this.id = id ?? uuidv4();
    }
}
