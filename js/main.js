const categories = ['cs2', 'rust', 'pubg'];
const streamsGrid = document.getElementById('streams-grid');
const categoryBtns = document.querySelectorAll('.category-btn');

const demoStreams = {
  cs2: [
    { title: 'CS2 Stream #1', channel: 'player1', viewers: 12000 },
    { title: 'CS2 Stream #2', channel: 'player2', viewers: 9500 },
    { title: 'CS2 Stream #3', channel: 'player3', viewers: 8000 },
    { title: 'CS2 Stream #4', channel: 'player4', viewers: 7000 },
    { title: 'CS2 Stream #5', channel: 'player5', viewers: 6000 },
  ],
  rust: [
    { title: 'Rust Stream #1', channel: 'rustacean1', viewers: 9000 },
    { title: 'Rust Stream #2', channel: 'rustacean2', viewers: 8500 },
    { title: 'Rust Stream #3', channel: 'rustacean3', viewers: 7000 },
    { title: 'Rust Stream #4', channel: 'rustacean4', viewers: 6500 },
    { title: 'Rust Stream #5', channel: 'rustacean5', viewers: 6000 },
  ],
  pubg: [
    { title: 'PUBG Stream #1', channel: 'pubger1', viewers: 8000 },
    { title: 'PUBG Stream #2', channel: 'pubger2', viewers: 7500 },
    { title: 'PUBG Stream #3', channel: 'pubger3', viewers: 7000 },
    { title: 'PUBG Stream #4', channel: 'pubger4', viewers: 6500 },
    { title: 'PUBG Stream #5', channel: 'pubger5', viewers: 6000 },
  ],
};

function renderStreams(category) {
  streamsGrid.innerHTML = '';
  demoStreams[category].forEach(stream => {
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    tile.innerHTML = `
      <div style="position:relative;width:100%;height:180px;background:#111;display:flex;align-items:center;justify-content:center;">
        <span style="color:#FFD700;font-size:2.5rem;">▶</span>
      </div>
      <div class="stream-title">${stream.title}</div>
      <div class="stream-meta">Канал: <b>${stream.channel}</b><br>Зрителей: <b>${stream.viewers}</b></div>
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