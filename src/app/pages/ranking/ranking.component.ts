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
  logoImg: HTMLImageElement | null = null;

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

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r < 40 && g < 50 && b < 90) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      this.logoBase64 = canvas.toDataURL('image/png');
      this.logoImg = img;
    };
  }

atualizarRanking(): void {
  const listaJogadores = this.storage.obter() || [];
  const historico = this.storage.obterHistorico();
  const numeroJogador = this.storage.buscarNumeroJogador() || 2;

  // Mapa de jogadores por ID
  const mapa: { [id: string]: Jogador } = {};
  for (const j of listaJogadores) {
    if (!mapa[j.id]) {
      mapa[j.id] = { ...j };
    } else {
      mapa[j.id].vitorias += j.vitorias;
    }
  }

  // ✅ Ranking individual por vitórias (tabela de jogadores)
  this.jogadores = [...Object.values(mapa)].sort(
    (a, b) => (b.vitorias || 0) - (a.vitorias || 0)
  );

  // ✅ Agrupa histórico por combinação de IDs (chave = IDs ordenados)
  const contagemTimes: { [chave: string]: { ids: string[], vitorias: number } } = {};

  for (const registro of historico) {
    const chave = [...registro.ids].sort().join('|');
    if (!contagemTimes[chave]) {
      contagemTimes[chave] = { ids: registro.ids, vitorias: 0 };
    }
    contagemTimes[chave].vitorias += 1;
  }

  // ✅ Monta os times do ranking a partir do histórico real
  this.times = [];
  let numeroTime = 1;

  const timesOrdenados = Object.values(contagemTimes)
    .sort((a, b) => b.vitorias - a.vitorias);

  for (const entry of timesOrdenados) {
    const time = new Time();
    time.numero = numeroTime++;
    time.vitorias = entry.vitorias;
    time.jogadores = entry.ids
      .map(id => mapa[id])
      .filter(j => !!j); // ignora jogadores removidos
    this.times.push(time);
  }

  // ✅ Se não há histórico, monta times pela fila como fallback
  if (this.times.length === 0 && listaJogadores.length > 0) {
    const jogadoresNaOrdem = listaJogadores
      .filter((j, index, self) => self.findIndex(x => x.id === j.id) === index)
      .map(j => mapa[j.id]);

    let timeAtual = new Time();
    timeAtual.numero = numeroTime;
    this.times.push(timeAtual);

    for (const jogador of jogadoresNaOrdem) {
      if (!timeAtual.temVaga(numeroJogador)) {
        timeAtual = new Time();
        numeroTime++;
        timeAtual.numero = numeroTime;
        this.times.push(timeAtual);
      }
      timeAtual.jogadores.push(jogador);
    }
  }
}

  gerarFoto(): void {
    const elemento = document.getElementById('ranking-para-foto') as HTMLElement;
    if (!elemento) return;

    html2canvas(elemento, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
    }).then(rankingCanvas => {
      const w = 1080;
      const h = 1920;
      const storyCanvas = document.createElement('canvas');
      storyCanvas.width = w;
      storyCanvas.height = h;
      const ctx = storyCanvas.getContext('2d');
      if (!ctx) return;

      // Fundo gradiente
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#060e1f');
      gradient.addColorStop(0.4, '#0d1b3e');
      gradient.addColorStop(1, '#1a2a5e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Bolas de vôlei
      const drawVolleyball = (cx: number, cy: number, r: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(26,42,94,0.8)';
        ctx.fill();
        ctx.strokeStyle = '#f0c020';
        ctx.lineWidth = r * 0.06;
        ctx.stroke();
        ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx - r * 0.5, cy, r * 0.85, -0.5, 0.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + r * 0.5, cy, r * 0.85, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy - r * 0.5, r * 0.85, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.restore();
      };

      drawVolleyball(100, 180, 110, 0.15);
      drawVolleyball(980, 300, 90, 0.13);
      drawVolleyball(60, 980, 75, 0.11);
      drawVolleyball(1020, 850, 65, 0.10);
      drawVolleyball(150, 1680, 95, 0.13);
      drawVolleyball(960, 1600, 80, 0.11);
      drawVolleyball(530, 80, 55, 0.08);
      drawVolleyball(530, 1840, 60, 0.08);
      drawVolleyball(300, 500, 40, 0.06);
      drawVolleyball(780, 1400, 45, 0.06);

      // Quadra decorativa
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.strokeStyle = '#f0c020';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, h * 0.08, w - 160, h * 0.84);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(80, h * 0.08 + (h * 0.84) / 3); ctx.lineTo(w - 80, h * 0.08 + (h * 0.84) / 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(80, h * 0.08 + (h * 0.84) * 2 / 3); ctx.lineTo(w - 80, h * 0.08 + (h * 0.84) * 2 / 3); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2, h / 2, 140, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Redes
      const drawNet = (yTop: number, yBottom: number) => {
        ctx.save();
        ctx.globalAlpha = 0.09;
        ctx.strokeStyle = '#f0c020';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(60, yTop); ctx.lineTo(60, yBottom); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - 60, yTop); ctx.lineTo(w - 60, yBottom); ctx.stroke();
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(60, yTop + 20); ctx.lineTo(w - 60, yTop + 20); ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(60, yBottom - 10); ctx.lineTo(w - 60, yBottom - 10); ctx.stroke();
        ctx.lineWidth = 1.5;
        for (let x = 60; x <= w - 60; x += 35) { ctx.beginPath(); ctx.moveTo(x, yTop + 20); ctx.lineTo(x, yBottom - 10); ctx.stroke(); }
        for (let y = yTop + 20; y <= yBottom - 10; y += 25) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w - 60, y); ctx.stroke(); }
        ctx.restore();
      };
      drawNet(120, 320);
      drawNet(h - 320, h - 120);

      // Faixas bordas
      const topGrad = ctx.createLinearGradient(0, 0, w, 0);
      topGrad.addColorStop(0, 'transparent');
      topGrad.addColorStop(0.3, '#f0c020');
      topGrad.addColorStop(0.7, '#fff8dc');
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, 8);
      ctx.fillRect(0, h - 8, w, 8);

      const sideGrad = ctx.createLinearGradient(0, 0, 0, h);
      sideGrad.addColorStop(0, 'transparent');
      sideGrad.addColorStop(0.5, 'rgba(240,192,32,0.4)');
      sideGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sideGrad;
      ctx.fillRect(0, 0, 5, h);
      ctx.fillRect(w - 5, 0, 5, h);

      // Marca d'água
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = '#f0c020';
      ctx.font = 'bold 180px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VÔLEI', w / 2, 260);
      ctx.font = 'bold 130px Arial';
      ctx.fillText('MATCHPOINT', w / 2, h - 60);
      ctx.restore();

      // Textos laterais
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = '#f0c020';
      ctx.font = 'bold 26px Arial';
      ctx.textAlign = 'center';
      ctx.translate(28, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('🏐 GRUPO DE VÔLEI • MATCHPOINT V.T. • GRUPO DE VÔLEI • MATCHPOINT V.T. 🏐', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = '#f0c020';
      ctx.font = 'bold 26px Arial';
      ctx.textAlign = 'center';
      ctx.translate(w - 28, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillText('🏐 GRUPO DE VÔLEI • MATCHPOINT V.T. • GRUPO DE VÔLEI • MATCHPOINT V.T. 🏐', 0, 0);
      ctx.restore();

      // Estrelas
      const stars = [
        { x: 200, y: 120, r: 5 }, { x: 880, y: 160, r: 4 },
        { x: 50, y: 700, r: 3 }, { x: 1030, y: 650, r: 4 },
        { x: 300, y: 1750, r: 5 }, { x: 800, y: 1780, r: 3 },
        { x: 540, y: 50, r: 4 }, { x: 540, y: 1870, r: 4 },
        { x: 120, y: 1400, r: 3 }, { x: 960, y: 1200, r: 3 },
      ];
      stars.forEach(s => {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#f0c020';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Ranking centralizado — margem reduzida para mostrar bordas completas
      const margem = 20;
      const rankingW = w - margem * 2;
      const rankingScale = rankingW / rankingCanvas.width;
      const rankingH = rankingCanvas.height * rankingScale;
      const rankingY = (h - rankingH) / 2;
      ctx.drawImage(rankingCanvas, margem, rankingY, rankingW, rankingH);

      const link = document.createElement('a');
      link.download = 'ranking-matchpoint.png';
      link.href = storyCanvas.toDataURL('image/png');
      link.click();
    });
  }

  limparRanking(): void {
    const lista = this.storage.obter();
    lista.forEach(j => j.vitorias = 0);
    this.storage.salvarLista(lista);
    this.atualizarRanking();
  }
}