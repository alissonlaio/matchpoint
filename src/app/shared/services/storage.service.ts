import { Injectable } from '@angular/core';
import { Jogador } from '../models/jogador';
import { BehaviorSubject } from 'rxjs';

export interface TimeVencedorHistorico {
  ids: string[];
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly keyJogadores = 'lista';
  private readonly keyNumeroJogador = 'numeroJogador';
  private readonly keyCongelar = 'congelarTimeTela';
  private readonly keyHistorico = 'historicoTimes';

  private jogadoresSubject = new BehaviorSubject<Jogador[]>(this.obter());
  public jogadores$ = this.jogadoresSubject.asObservable();

  constructor() {}

  obter(): Jogador[] {
    const lista = localStorage.getItem(this.keyJogadores);
    return lista ? JSON.parse(lista) : [];
  }

  salvarLista(lista: Jogador[]): void {
    localStorage.setItem(this.keyJogadores, JSON.stringify(lista));
    this.jogadoresSubject.next(lista);
  }

  adicionarJogador(jogador: Jogador): void {
    const lista = this.obter();
    lista.push(jogador);
    this.salvarLista(lista);
  }

  removerJogador(id: string): void {
    const lista = this.obter().filter(j => j.id !== id);
    this.salvarLista(lista);
  }

  editar(jogador: Jogador, nome: string): void {
    const lista = this.obter();
    const index = lista.findIndex(j => j.id === jogador.id);
    if (index > -1) {
      lista[index].nome = nome;
      this.salvarLista(lista);
    }
  }

  incluirNumeroJogadores(numero: number): void {
    localStorage.setItem(this.keyNumeroJogador, JSON.stringify(numero));
  }

  buscarNumeroJogador(): number {
    const valor = localStorage.getItem(this.keyNumeroJogador);
    return valor ? JSON.parse(valor) : 2;
  }

  setCongelar(valor: boolean): void {
    localStorage.setItem(this.keyCongelar, JSON.stringify(valor));
  }

  obterLocalStorage(): boolean {
    const valor = localStorage.getItem(this.keyCongelar);
    return valor ? JSON.parse(valor) : false;
  }

  // ✅ Salva um time vencedor no histórico
  salvarTimeVencedor(ids: string[]): void {
    const historico = this.obterHistorico();
    historico.push({ ids, data: new Date().toISOString() });
    localStorage.setItem(this.keyHistorico, JSON.stringify(historico));
  }

  // ✅ Retorna todo o histórico de times vencedores
  obterHistorico(): TimeVencedorHistorico[] {
    const valor = localStorage.getItem(this.keyHistorico);
    return valor ? JSON.parse(valor) : [];
  }

  // ✅ Limpa histórico junto com o resto
  limpar(): void {
    localStorage.removeItem(this.keyJogadores);
    localStorage.removeItem(this.keyNumeroJogador);
    localStorage.removeItem(this.keyCongelar);
    localStorage.removeItem(this.keyHistorico);
    this.jogadoresSubject.next([]);
  }
}