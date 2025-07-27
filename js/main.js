const streams = [
  {
    channel: 'dis_1',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/2e2e2e2e-profile_image-70x70.png',
    title: 'DIS_1 24/7',
    viewers: 1200
  },
  {
    channel: 'big_cuzo',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3b3b3b3b-profile_image-70x70.png',
    title: 'Big Cuzo',
    viewers: 980
  },
  {
    channel: 'widdz',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4c4c4c4c-profile_image-70x70.png',
    title: 'Widdz',
    viewers: 2100
  },
  {
    channel: 'theburntpeanut_247',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/5d5d5d5d-profile_image-70x70.png',
    title: 'TheBurntPeanut 24/7',
    viewers: 1500
  },
  {
    channel: 'shrood',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6e6e6e6e-profile_image-70x70.png',
    title: 'Shrood',
    viewers: 1700
  },
  {
    channel: 'blurbstv',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/7f7f7f7f-profile_image-70x70.png',
    title: 'BlurbsTV',
    viewers: 800
  },
  {
    channel: 'snacksypoo247',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/8a8a8a8a-profile_image-70x70.png',
    title: 'Snacksypoo 24/7',
    viewers: 600
  },
  {
    channel: 'toriasmr',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/9b9b9b9b-profile_image-70x70.png',
    title: 'ToriASMR',
    viewers: 1100
  },
  {
    channel: 'yugioh_official',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/aaaaaaa-profile_image-70x70.png',
    title: 'Yu-Gi-Oh! Official',
    viewers: 900
  },
  {
    channel: 'retrocrush_tv',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/bbbbbbb-profile_image-70x70.png',
    title: 'RetroCrush TV',
    viewers: 700
  },
  {
    channel: 'alf',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/ccccccc-profile_image-70x70.png',
    title: 'ALF',
    viewers: 500
  },
  {
    channel: 'lirik_247',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/ddddddd-profile_image-70x70.png',
    title: 'Lirik 24/7',
    viewers: 1300
  }
];

const streamsGrid = document.getElementById('streams-grid');

function renderStreams() {
  streamsGrid.innerHTML = '';
  streams.forEach((stream, idx) => {
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    tile.innerHTML = `
      <div class="twitch-embed-container">
        <iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=${location.hostname}&autoplay=true&muted=true&time=0s" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="stream-info">
        <img class="stream-avatar" src="${stream.avatar}" alt="${stream.channel}">
        <div class="stream-meta">
          <div class="stream-title">${stream.title}</div>
          <a class="stream-channel" href="https://www.twitch.tv/${stream.channel}" target="_blank">${stream.channel}</a>
          <div class="stream-viewers">${stream.viewers} зрителей</div>
        </div>
      </div>
    `;
    tile.addEventListener('click', () => openBigStream(stream));
    streamsGrid.appendChild(tile);
  });
}

function openBigStream(stream) {
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
          <img class="stream-avatar" src="" alt="">
          <div class="stream-title"></div>
          <a class="stream-channel" href="#" target="_blank"></a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.big-stream-close').onclick = closeBigStream;
    modal.querySelector('.big-stream-backdrop').onclick = closeBigStream;
  }
  // Заполняем данные
  modal.querySelector('.big-stream-iframe-wrap').innerHTML =
    `<iframe src="https://player.twitch.tv/?channel=${stream.channel}&parent=${location.hostname}&autoplay=true&time=0s" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
  modal.querySelector('.stream-avatar').src = stream.avatar;
  modal.querySelector('.stream-avatar').alt = stream.channel;
  modal.querySelector('.stream-title').textContent = stream.title;
  modal.querySelector('.stream-channel').href = `https://www.twitch.tv/${stream.channel}`;
  modal.querySelector('.stream-channel').textContent = stream.channel;
  modal.style.display = 'flex';
  setTimeout(() => { modal.classList.add('show'); }, 10);
}

function closeBigStream() {
  const modal = document.getElementById('big-stream-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 200);
  }
}

renderStreams();