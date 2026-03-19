import { Jogador } from './jogador';

export class Time {
  id: string;
  jogadores: Jogador[];
  vitorias: number;
  numero: number; // ✅ novo campo

  constructor() {
    this.id = crypto.randomUUID();
    this.jogadores = [];
    this.vitorias = 0;
    this.numero = 0;
  }

  temVaga(max: number): boolean {
    return this.jogadores.length < max;
  }
}