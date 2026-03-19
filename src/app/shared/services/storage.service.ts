import { Injectable } from '@angular/core';
import { Jogador } from '../models/jogador';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly keyJogadores = 'lista';
  private readonly keyNumeroJogador = 'numeroJogador';
  private readonly keyCongelar = 'congelarTimeTela';

  // 🔹 BehaviorSubject para notificar mudanças no ranking
  private jogadoresSubject = new BehaviorSubject<Jogador[]>(this.obter());
  public jogadores$ = this.jogadoresSubject.asObservable();

  constructor() {}

  // 🔹 Retorna lista de jogadores
  obter(): Jogador[] {
    const lista = localStorage.getItem(this.keyJogadores);
    return lista ? JSON.parse(lista) : [];
  }

  // 🔹 Salva lista e notifica componentes inscritos
  salvarLista(lista: Jogador[]): void {
    localStorage.setItem(this.keyJogadores, JSON.stringify(lista));
    this.jogadoresSubject.next(lista); // notifica RankingComponent e outros
  }

  // 🔹 Adiciona jogador
  adicionarJogador(jogador: Jogador): void {
    const lista = this.obter();
    lista.push(jogador);
    this.salvarLista(lista); // atualiza BehaviorSubject
  }

  // 🔹 Remove jogador por ID
  removerJogador(id: string): void {
    const lista = this.obter().filter(j => j.id !== id);
    this.salvarLista(lista); // atualiza BehaviorSubject
  }

  // 🔹 Edita nome do jogador
  editar(jogador: Jogador, nome: string): void {
    const lista = this.obter();
    const index = lista.findIndex(j => j.id === jogador.id);
    if (index > -1) {
      lista[index].nome = nome;
      this.salvarLista(lista); // atualiza BehaviorSubject
    }
  }

  // 🔹 Número de jogadores por time
  incluirNumeroJogadores(numero: number): void {
    localStorage.setItem(this.keyNumeroJogador, JSON.stringify(numero));
  }

  buscarNumeroJogador(): number {
    const valor = localStorage.getItem(this.keyNumeroJogador);
    return valor ? JSON.parse(valor) : 2; // padrão 2
  }

  // 🔹 Congelamento de times
  setCongelar(valor: boolean): void {
    localStorage.setItem(this.keyCongelar, JSON.stringify(valor));
  }

  obterLocalStorage(): boolean {
    const valor = localStorage.getItem(this.keyCongelar);
    return valor ? JSON.parse(valor) : false;
  }

  // 🔹 Limpar tudo
  limpar(): void {
    localStorage.removeItem(this.keyJogadores);
    localStorage.removeItem(this.keyNumeroJogador);
    localStorage.removeItem(this.keyCongelar);
    this.jogadoresSubject.next([]); // notifica que está vazio
  }
}