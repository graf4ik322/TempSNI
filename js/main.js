const streamsGrid = document.getElementById('streams-grid');
const categoryBtns = document.querySelectorAll('.category-btn');

// Популярные Twitch-каналы по категориям (можно обновить по желанию)
const twitchStreams = {
  cs2: [
    { title: 's1mple', channel: 's1mple', viewers: null },
    { title: 'Gaules', channel: 'gaules', viewers: null },
    { title: 'ESL_CSGO', channel: 'esl_csgo', viewers: null },
    { title: 'fl0m', channel: 'fl0m', viewers: null },
    { title: 'Pimp', channel: 'pimp', viewers: null },
  ],
  rust: [
    { title: 'hJune', channel: 'hjune', viewers: null },
    { title: 'Blooprint', channel: 'blooprint', viewers: null },
    { title: 'Frost', channel: 'frost', viewers: null },
    { title: 'Welyn', channel: 'welyn', viewers: null },
    { title: 'Stevie', channel: 'stevie', viewers: null },
  ],
  pubg: [
    { title: 'chocoTaco', channel: 'chocotaco', viewers: null },
    { title: 'halifax', channel: 'halifax', viewers: null },
    { title: 'TGLTN', channel: 'tgltn', viewers: null },
    { title: 'Ibiza', channel: 'ibiza', viewers: null },
    { title: 'TheRealKraftyy', channel: 'therealkraftyy', viewers: null },
  ],
};

function renderStreams(category) {
  streamsGrid.innerHTML = '';
  twitchStreams[category].forEach(stream => {
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    tile.innerHTML = `
      <div style="position:relative;width:100%;height:180px;background:#111;display:flex;align-items:center;justify-content:center;overflow:hidden;">
        <iframe
          src="https://player.twitch.tv/?channel=${stream.channel}&parent=${location.hostname}"
          frameborder="0"
          allowfullscreen="true"
          scrolling="no"
          height="180"
          width="100%"
          style="border:none;display:block;background:#111;"
        ></iframe>
      </div>
      <div class="stream-title">${stream.title}</div>
      <div class="stream-meta">Канал: <b>${stream.channel}</b></div>
    `;
    streamsGrid.appendChild(tile);
  });
}

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.category-btn.active').classList.remove('active');
    btn.classList.add('active');
    renderStreams(btn.dataset.category);
  });
});

// По умолчанию показываем CS2
renderStreams('cs2');