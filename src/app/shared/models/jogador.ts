import {v4 as uuidv4} from 'uuid';
export class Jogador {
    id: string;
    nome: string;
    vitorias: number; // novo campo
  
    constructor(nome: string) {
      this.id = crypto.randomUUID();
      this.nome = nome;
      this.vitorias = 0;
    }
  }
