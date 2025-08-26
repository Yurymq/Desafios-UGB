
const motesEl = document.getElementById('motes');
const spawnMotes = (n = 48) => {
  const w = innerWidth, h = innerHeight;
  motesEl.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const m = document.createElement('div');
    m.className = 'mote';
    const x = Math.random() * w;
    const y = Math.random() * h;
    const dx = (Math.random() * 2 - 1) * w * 0.18;
    const dy = - (80 + Math.random() * 260);
    const d = 6 + Math.random() * 10;
    m.style.left = x + 'px';
    m.style.top = y + 'px';
    m.style.setProperty('--dx', dx + 'px');
    m.style.setProperty('--dy', dy + 'px');
    m.style.animationDuration = d + 's';
    motesEl.appendChild(m);
  }
};
spawnMotes();
addEventListener('resize', () => spawnMotes());


const btn = document.getElementById('fetchBtn');
const result = document.getElementById('result');

async function fetchCharacter() {
  try {
    btn.disabled = true;
    btn.textContent = 'Summoning…';

    const id = Math.floor(1 + Math.random() * 826);
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const c = await res.json();
    renderCard(c);
  } catch (err) {
    console.error(err);
    result.innerHTML = `<div role="alert" class="badge">Algo deu errado ao invocar. Tente novamente.</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Summon Character';
  }
}

function renderCard(c) {
  const lore = `Nascido (ou criado) em ${c.origin?.name || 'lugares estranhos'}, ${c.name} é ${c.species.toLowerCase()} e atualmente está ${c.status.toLowerCase()}. Última localização conhecida: ${c.location?.name || '—'}.`;
  result.innerHTML = `
    <article class="card" aria-label="Personagem invocado">
      <div class="imgwrap" aria-hidden="true">
        <img alt="Retrato de ${escapeHtml(c.name)}" src="${c.image}" loading="lazy" />
      </div>
      <div class="info">
        <div class="name">${escapeHtml(c.name)}</div>
        <div class="meta">
          <span class="badge">Espécie: ${escapeHtml(c.species)}</span>
          <span class="badge">Status: ${escapeHtml(c.status)}</span>
          ${c.type ? `<span class="badge">Tipo: ${escapeHtml(c.type)}</span>` : ''}
          <span class="badge">Origem: ${escapeHtml(c.origin?.name || 'Desconhecida')}</span>
          <span class="badge">Local: ${escapeHtml(c.location?.name || '—')}</span>
        </div>
        <p class="desc">${escapeHtml(lore)}</p>
      </div>
    </article>
  `;
}


function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

btn.addEventListener('click', fetchCharacter);
addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) {
    e.preventDefault();
    fetchCharacter();
  }
});


fetchCharacter();
