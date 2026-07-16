// ==========================================
// 1. CONTROLE DO MENU MOBILE
// ==========================================
const menuToggle = document.querySelector(".menu-toggle");
const menuNavegacao = document.querySelector(".menuNavegacao");

if (menuToggle && menuNavegacao) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    menuNavegacao.classList.toggle("active");
  });

  const linksNavegacao = document.querySelectorAll(".menuNavegacaoItem");
  linksNavegacao.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      menuNavegacao.classList.remove("active");
    });
  });
}

// ==========================================
// 2. LÓGICA DO NETLIFY IDENTITY
// ==========================================
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", (user) => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

// ==========================================
// 3. CARREGAMENTO DINÂMICO DA AGENDA
// ==========================================
async function carregarAgenda() {
  const agendaContainer = document.querySelector(".agendaContainer");
  
  if (!agendaContainer) return;

  try {
    const resposta = await fetch("/data/agenda.json");
    if (!resposta.ok) throw new Error("Erro ao carregar o arquivo da agenda.");
    
    const dados = await resposta.json();
    const eventos = dados.eventos || [];

    if (eventos.length === 0) {
      agendaContainer.innerHTML = `<p class="agendaVazia">Nenhum evento programado no momento.</p>`;
      return;
    }

    agendaContainer.innerHTML = "";

    eventos.forEach(evento => {
      const dataObj = new Date(evento.data + "T00:00:00");
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = dataObj.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "");

      const eventoCard = document.createElement("div");
      eventoCard.className = "eventoCard";

      eventoCard.innerHTML = `
        <div class="eventoDataBox">
          <span class="eventoDia">${dia}</span>
          <span class="eventoMes">${mes}</span>
        </div>
        <div class="eventoDetalhes">
          <h3 class="eventoNome">${evento.titulo}</h3>
          <p class="eventoHorario"><i class="ph ph-clock"></i> ${evento.horario}</p>
          <p class="eventoLocal"><i class="ph ph-map-pin"></i> ${evento.local}</p>
        </div>
      `;

      agendaContainer.appendChild(eventoCard);
    });

  } catch (erro) {
    console.error("Erro na agenda:", erro);
    agendaContainer.innerHTML = `<p class="agendaVazia">Não foi possível carregar a agenda de eventos no momento.</p>`;
  }
}

// ==========================================
// 4. CARREGAMENTO DINÂMICO DO CARROSSEL (GALERIA)
// ==========================================
function ehVideo(url) {
  if (!url) return false;
  const extensoesVideo = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
  return extensoesVideo.some(extensao => url.toLowerCase().endsWith(extensao));
}

async function inicializarCarrossel() {
  const container = document.getElementById('galeria-container');
  if (!container) return;

  try {
    // Busca os dados salvos pelo Netlify CMS
    const resposta = await fetch('/data/galeria.json');
    if (!resposta.ok) throw new Error('Erro ao carregar os dados da galeria.');
    
    const dados = await resposta.json();
    const fotos = dados.fotos || [];

    container.innerHTML = '';

    if (fotos.length === 0) {
      container.innerHTML = '<p style="text-align:center; width:100%; color: #fff;">Nenhuma mídia cadastrada na galeria.</p>';
      return;
    }

    // Cria os slides dinamicamente
    fotos.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'carrossel-slide';

      let caminhoMidia = item.imagem;
      if (caminhoMidia && !caminhoMidia.startsWith('/')) {
        caminhoMidia = '/' + caminhoMidia;
      }

      // Verifica se é vídeo ou imagem e aplica as tags corretas
      if (ehVideo(caminhoMidia)) {
        const video = document.createElement('video');
        video.src = caminhoMidia;
        video.autoplay = true;
        video.loop = true;
        video.muted = true; // Necessário para permitir autoplay na maioria dos navegadores
        video.playsInline = true; 
        video.setAttribute('preload', 'metadata');
        slide.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = caminhoMidia;
        img.alt = item.legenda || 'Apresentação Orquestra';
        img.loading = 'lazy';
        slide.appendChild(img);
      }

      // Adiciona legenda caso exista
      if (item.legenda) {
        const legenda = document.createElement('p');
        legenda.className = 'carrossel-legenda';
        legenda.textContent = item.legenda;
        slide.appendChild(legenda);
      }

      container.appendChild(slide);
    });

  } catch (erro) {
    console.error('Erro na galeria:', erro);
    container.innerHTML = '<p style="text-align:center; width:100%; color: #fff;">Erro ao carregar as mídias.</p>';
  }
}

// ==========================================
// INICIALIZAÇÃO GERAL DO DOM
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  carregarAgenda();
  inicializarCarrossel();
});

// ==========================================
// 5. COPIAR E-MAIL NO CELULAR
// ==========================================
const emailBotao = document.querySelector(".EmailLink");

if (emailBotao) {
  emailBotao.addEventListener("click", (e) => {
    // Detecta se é um dispositivo móvel básico
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      e.preventDefault(); // Impede o comportamento padrão do mailto
      
      const email = "seu-email@dominio.com"; // Substitua pelo e-mail do projeto
      
      navigator.clipboard.writeText(email).then(() => {
        // Altera temporariamente o texto do botão para dar um feedback visual
        const textoOriginal = emailBotao.innerHTML;
        emailBotao.innerHTML = '<i class="ph ph-check"></i> E-mail copiado!';
        emailBotao.style.backgroundColor = "#008000";
        emailBotao.style.color = "#ffffff";
        
        setTimeout(() => {
          emailBotao.innerHTML = textoOriginal;
          emailBotao.style.backgroundColor = "transparent";
          emailBotao.style.color = "#ffffff";
        }, 2000);
      }).catch(err => {
        console.error("Erro ao copiar e-mail: ", err);
      });
    }
  });
}