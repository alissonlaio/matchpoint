import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { Time } from '../../shared/models/time';
import { Jogador } from '../../shared/models/jogador';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  times: Time[] = [];
  jogadores: Jogador[] = [];
  logoBase64: string = '';

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
    this.atualizarRanking();
    this.converterLogoBase64();

    this.storage.jogadores$.subscribe(() => {
      this.atualizarRanking();
    });
  }

  converterLogoBase64(): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'assets/demo/images/unnamed.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.drawImage(img, 0, 0);
  
      // Remove pixels escuros próximos ao fundo #0d1b3e (13, 27, 62)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
  
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        // Se o pixel for parecido com o fundo escuro azul, torna transparente
        if (r < 40 && g < 50 && b < 90) {
          data[i + 3] = 0; // alpha = 0 (transparente)
        }
      }
  
      ctx.putImageData(imageData, 0, 0);
      this.logoBase64 = canvas.toDataURL('image/png');
    };
  }
  atualizarRanking(): void {
    const listaJogadores = this.storage.obter() || [];

    const mapa: { [id: string]: Jogador } = {};
    for (const j of listaJogadores) {
      if (!mapa[j.id]) {
        mapa[j.id] = { ...j };
      } else {
        mapa[j.id].vitorias += j.vitorias;
      }
    }

    const jogadoresComVitorias = Object.values(mapa);
    this.jogadores = [...jogadoresComVitorias].sort((a, b) => b.vitorias - a.vitorias);

    this.times = [];
    const numeroJogador = this.storage.buscarNumeroJogador() || 2;
    let timeAtual = new Time();
    let numeroTime = 1;
    timeAtual.numero = numeroTime; // ✅ numera na ordem da lista
    this.times.push(timeAtual);

    for (const jogador of jogadoresComVitorias) {
      if (!timeAtual.temVaga(numeroJogador)) {
        timeAtual.vitorias = timeAtual.jogadores[0]?.vitorias || 0;
        timeAtual = new Time();
        numeroTime++;
        timeAtual.numero = numeroTime; // ✅
        this.times.push(timeAtual);
      }
      timeAtual.jogadores.push(jogador);
    }

    timeAtual.vitorias = timeAtual.jogadores[0]?.vitorias || 0;
    this.times.sort((a, b) => b.vitorias - a.vitorias);
  }

  gerarFoto(): void {
    const elemento = document.getElementById('ranking-para-foto');
    const img = elemento?.querySelector('img') as HTMLImageElement;
  
    if (!elemento) return;
  
    // Converte a imagem para base64 primeiro
    const canvas2 = document.createElement('canvas');
    const ctx = canvas2.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = img.src;
  
    image.onload = () => {
      html2canvas(elemento, {
        backgroundColor: '#0d1b3e',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (doc) => {
          const cloneImg = doc.querySelector('#ranking-para-foto img') as HTMLImageElement;
          if (cloneImg) {
            cloneImg.style.display = 'block';
          }
        }
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'ranking-matchpoint.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    };
  }

  // Reseta vitórias de todos os jogadores
  limparRanking(): void {
    const lista = this.storage.obter();
    lista.forEach(j => j.vitorias = 0);
    this.storage.salvarLista(lista);
    this.atualizarRanking();
  }
}