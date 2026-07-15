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
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  carregarAgenda();
});