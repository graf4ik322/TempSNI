const svgIcons = [
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><path d="M24 10l3.09 6.26L34 17.27l-5 4.87L30.18 29 24 25.27 17.82 29 19 22.14l-5-4.87 6.91-1.01L24 10z" fill="#FFD700"/></svg>`,
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><path d="M24 12a12 12 0 100 24 12 12 0 000-24zm0 2a10 10 0 110 20 10 10 0 010-20zm-2 5v6h6v2h-8v-8h2z" fill="#FFD700"/></svg>`,
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><path d="M24 10l8 14h-6l2 10-8-14h6l-2-10z" fill="#FFD700"/></svg>`,
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><rect x="14" y="20" width="20" height="8" rx="4" fill="#FFD700"/><rect x="18" y="16" width="12" height="4" rx="2" fill="#FFD700"/></svg>`,
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><path d="M24 12l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8z" fill="#FFD700"/></svg>`,
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><rect x="18" y="18" width="12" height="12" rx="6" fill="#FFD700"/><rect x="22" y="14" width="4" height="4" rx="2" fill="#FFD700"/></svg>`,
  `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><path d="M24 10l6 12h-4l2 8-6-12h4l-2-8z" fill="#FFD700"/></svg>`
];

const streams = [
  { channel: 'dis_1', avatar: '', title: 'DIS_1 24/7', viewers: 1200 },
  { channel: 'big_cuzo', avatar: '', title: 'Big Cuzo', viewers: 980 },
  { channel: 'widdz', avatar: '', title: 'Widdz', viewers: 2100 },
  { channel: 'theburntpeanut_247', avatar: '', title: 'TheBurntPeanut 24/7', viewers: 1500 },
  { channel: 'shrood', avatar: '', title: 'Shrood', viewers: 1700 },
  { channel: 'blurbstv', avatar: '', title: 'BlurbsTV', viewers: 800 },
  { channel: 'snacksypoo247', avatar: '', title: 'Snacksypoo 24/7', viewers: 600 },
  { channel: 'toriasmr', avatar: '', title: 'ToriASMR', viewers: 1100 },
  { channel: 'yugioh_official', avatar: '', title: 'Yu-Gi-Oh! Official', viewers: 900 },
  { channel: 'retrocrush_tv', avatar: '', title: 'RetroCrush TV', viewers: 700 },
  { channel: 'alf', avatar: '', title: 'ALF', viewers: 500 },
  { channel: 'lirik_247', avatar: '', title: 'Lirik 24/7', viewers: 1300 }
];

const streamsGrid = document.getElementById('streams-grid');
let miniIframes = [];
let miniSrcs = [];

function getRandomIcon() {
  return svgIcons[Math.floor(Math.random() * svgIcons.length)];
}

function renderStreams() {
  streamsGrid.innerHTML = '';
  miniIframes = [];
  miniSrcs = [];
  streams.forEach((stream, idx) => {
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    const avatarHTML = stream.avatar
      ? `<img class="stream-avatar" src="${stream.avatar}" alt="${stream.channel}">`
      : `<span class="stream-avatar stream-avatar-svg">${getRandomIcon()}</span>`;
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
    // Сохраняем iframe для управления src
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
  }
  modal.querySelector('.big-stream-iframe-wrap').innerHTML =
    `<iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=${location.hostname}&autoplay=true&time=0s" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
  // Аватар или иконка
  modal.querySelector('.big-stream-meta .stream-avatar').outerHTML = avatarHTML;
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