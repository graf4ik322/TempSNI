const universalAvatarSVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><ellipse cx="24" cy="20" rx="8" ry="8" fill="#FFD700"/><ellipse cx="24" cy="36" rx="13" ry="7" fill="#FFD700"/></svg>`;

const streams = [
  { channel: 'dis_1', title: 'DIS_1 24/7', viewers: 1200 },
  { channel: 'big_cuzo', title: 'Big Cuzo', viewers: 980 },
  { channel: 'widdz', title: 'Widdz', viewers: 2100 },
  { channel: 'theburntpeanut_247', title: 'TheBurntPeanut 24/7', viewers: 1500 },
  { channel: 'shrood', title: 'Shrood', viewers: 1700 },
  { channel: 'blurbstv', title: 'BlurbsTV', viewers: 800 },
  { channel: 'snacksypoo247', title: 'Snacksypoo 24/7', viewers: 600 },
  { channel: 'toriasmr', title: 'ToriASMR', viewers: 1100 },
  { channel: 'yugioh_official', title: 'Yu-Gi-Oh! Official', viewers: 900 },
  { channel: 'retrocrush_tv', title: 'RetroCrush TV', viewers: 700 },
  { channel: 'alf', title: 'ALF', viewers: 500 },
  { channel: 'lirik_247', title: 'Lirik 24/7', viewers: 1300 }
];

const streamsGrid = document.getElementById('streams-grid');
let miniIframes = [];
let miniSrcs = [];

function renderStreams() {
  streamsGrid.innerHTML = '';
  miniIframes = [];
  miniSrcs = [];
  streams.forEach((stream) => {
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    const avatarHTML = `<span class="stream-avatar stream-avatar-svg">${universalAvatarSVG}</span>`;
    tile.innerHTML = `
      <div class="twitch-embed-container">
        <iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=${location.hostname}&autoplay=true&muted=true&time=0s" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="stream-info">
        ${avatarHTML}
        <div class="stream-meta">
          <div class="stream-title">${stream.title}</div>
          <a class="stream-channel" href="https://www.twitch.tv/${stream.channel}" target="_blank">${stream.channel}</a>
          <div class="stream-viewers">${stream.viewers} зрителей</div>
        </div>
      </div>
    `;
    tile.addEventListener('click', () => openBigStream(stream, avatarHTML));
    streamsGrid.appendChild(tile);
    const iframe = tile.querySelector('iframe');
    miniIframes.push(iframe);
    miniSrcs.push(iframe.src);
  });
}

function openBigStream(stream, avatarHTML) {
  miniIframes.forEach(iframe => { iframe.src = 'about:blank'; });
  let modal = document.getElementById('big-stream-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'big-stream-modal';
    modal.innerHTML = `
      <div class="big-stream-backdrop"></div>
      <div class="big-stream-content">
        <button class="big-stream-close" title="Закрыть">×</button>
        <div class="big-stream-iframe-wrap"></div>
        <div class="big-stream-meta">
          <span class="stream-avatar stream-avatar-svg"></span>
          <div class="stream-title"></div>
          <a class="stream-channel" href="#" target="_blank"></a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.big-stream-close').onclick = closeBigStream;
    modal.querySelector('.big-stream-backdrop').onclick = closeBigStream;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBigStream();
    });
  }
  modal.querySelector('.big-stream-iframe-wrap').innerHTML =
    `<iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=${location.hostname}&autoplay=true&time=0s" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
  // Вставляем универсальный SVG
  const avatarContainer = modal.querySelector('.big-stream-meta .stream-avatar');
  avatarContainer.innerHTML = universalAvatarSVG;
  modal.querySelector('.big-stream-meta .stream-title').textContent = stream.title;
  modal.querySelector('.big-stream-meta .stream-channel').href = `https://www.twitch.tv/${stream.channel}`;
  modal.querySelector('.big-stream-meta .stream-channel').textContent = stream.channel;
  modal.style.display = 'flex';
  setTimeout(() => { modal.classList.add('show'); }, 10);
}

function closeBigStream() {
  const modal = document.getElementById('big-stream-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 200);
  }
  miniIframes.forEach((iframe, i) => { iframe.src = miniSrcs[i]; });
}

renderStreams();