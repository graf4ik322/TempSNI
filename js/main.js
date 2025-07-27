const TWITCH_PARENT = 'gate.edencore.cc';
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

function getRandomViewers() {
  return Math.floor(Math.random() * (8000 - 300 + 1)) + 300;
}

function renderStreams() {
  streamsGrid.innerHTML = '';
  streams.forEach((stream) => {
    const viewers = getRandomViewers();
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    const avatarHTML = `<span class="stream-avatar stream-avatar-svg">${universalAvatarSVG}</span>`;
    tile.innerHTML = `
      <div class="twitch-embed-container">
        <iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=${TWITCH_PARENT}&autoplay=true&muted=true" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
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
    streamsGrid.appendChild(tile);
  });
}

renderStreams();