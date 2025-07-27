const universalAvatarSVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="rgba(212,175,55,0.13)"/><ellipse cx="24" cy="20" rx="8" ry="8" fill="#FFD700"/><ellipse cx="24" cy="36" rx="13" ry="7" fill="#FFD700"/></svg>`;

const streams = [
  { channel: 'dis_1', title: 'DIS_1 24/7' },
  { channel: 'big_cuzo', title: 'Big Cuzo' },
  { channel: 'widdz', title: 'Widdz' },
  { channel: 'theburntpeanut_247', title: 'TheBurntPeanut 24/7' },
  { channel: 'shrood', title: 'Shrood' },
  { channel: 'blurbstv', title: 'BlurbsTV' },
  { channel: 'snacksypoo247', title: 'Snacksypoo 24/7' },
  { channel: 'toriasmr', title: 'ToriASMR' },
  { channel: 'yugioh_official', title: 'Yu-Gi-Oh! Official' },
  { channel: 'retrocrush_tv', title: 'RetroCrush TV' },
  { channel: 'alf', title: 'ALF' },
  { channel: 'lirik_247', title: 'Lirik 24/7' }
];

const streamsGrid = document.getElementById('streams-grid');
let miniIframes = [];
let miniSrcs = [];

function getRandomViewers() {
  return Math.floor(Math.random() * (8000 - 300 + 1)) + 300;
}

function renderStreams() {
  streamsGrid.innerHTML = '';
  miniIframes = [];
  miniSrcs = [];
  streams.forEach((stream) => {
    const viewers = getRandomViewers();
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    const avatarHTML = `<span class="stream-avatar stream-avatar-svg">${universalAvatarSVG}</span>`;
    tile.innerHTML = `
      <div class="twitch-embed-container">
        <iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=graf4ik322.github.io" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="stream-info">
        ${avatarHTML}
        <div class="stream-meta">
          <div class="stream-title">${stream.title}</div>
          <a class="stream-channel" href="https://www.twitch.tv/${stream.channel}" target="_blank">${stream.channel}</a>
          <div class="stream-viewers">${viewers} зрителей</div>
        </div>
      </div>
    `;
    tile.addEventListener('click', () => openBigStream(stream, viewers));
    streamsGrid.appendChild(tile);
    const iframe = tile.querySelector('iframe');
    miniIframes.push(iframe);
    miniSrcs.push(iframe.src);
  });
}

function openBigStream(stream, viewers) {
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
          <span class="stream-avatar stream-avatar-svg">${universalAvatarSVG}</span>
          <div class="stream-title"></div>
          <a class="stream-channel" href="#" target="_blank"></a>
          <div class="stream-viewers"></div>
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
  // Очищаем и вставляем iframe заново
  const iframeWrap = modal.querySelector('.big-stream-iframe-wrap');
  iframeWrap.innerHTML = '';
  const bigIframe = document.createElement('iframe');
  bigIframe.src = `https://player.twitch.tv/?channel=${stream.channel}&parent=graf4ik322.github.io&autoplay=true`;
  bigIframe.width = '800';
  bigIframe.height = '450';
  bigIframe.style.maxWidth = '90vw';
  bigIframe.style.maxHeight = '60vh';
  bigIframe.style.aspectRatio = '16/9';
  bigIframe.frameBorder = '0';
  bigIframe.allowFullscreen = true;
  iframeWrap.appendChild(bigIframe);
  // Заполняем мета
  modal.querySelector('.big-stream-meta .stream-title').textContent = stream.title;
  modal.querySelector('.big-stream-meta .stream-channel').href = `https://www.twitch.tv/${stream.channel}`;
  modal.querySelector('.big-stream-meta .stream-channel').textContent = stream.channel;
  modal.querySelector('.big-stream-meta .stream-viewers').textContent = viewers + ' зрителей';
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