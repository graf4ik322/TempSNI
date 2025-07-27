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
const statViewers = document.getElementById('stat-viewers');
const statStreams = document.getElementById('stat-streams');
const statUpdated = document.getElementById('stat-updated');
const randomBtn = document.getElementById('random-btn');
const themeToggle = document.getElementById('theme-toggle');
const fakeChat = document.getElementById('fake-chat');
const fakeChatMessages = document.getElementById('fake-chat-messages');

function getRandomViewers() {
  return Math.floor(Math.random() * (8000 - 300 + 1)) + 300;
}

function renderStreams() {
  streamsGrid.innerHTML = '';
  let totalViewers = 0;
  streams.forEach((stream, idx) => {
    const viewers = getRandomViewers();
    totalViewers += viewers;
    const tile = document.createElement('div');
    tile.className = 'stream-tile';
    // LIVE индикатор
    const liveHTML = `<span class="live-indicator"><span class="live-dot"></span>LIVE</span>`;
    const avatarHTML = `<span class="stream-avatar stream-avatar-svg">${universalAvatarSVG}</span>`;
    tile.innerHTML = `
      ${liveHTML}
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
    // Анимация появления
    setTimeout(() => tile.classList.add('animated'), 80 * idx);
    streamsGrid.appendChild(tile);
  });
  // Статистика
  statViewers.textContent = totalViewers;
  statStreams.textContent = streams.length;
}

// Статистика: обновлено X секунд назад
let lastUpdate = Date.now();
function updateStatTime() {
  const sec = Math.floor((Date.now() - lastUpdate) / 1000);
  statUpdated.textContent = sec;
}
setInterval(updateStatTime, 1000);

// Кнопка случайного стрима
randomBtn.onclick = () => {
  const tiles = Array.from(document.querySelectorAll('.stream-tile'));
  if (!tiles.length) return;
  const idx = Math.floor(Math.random() * tiles.length);
  tiles[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
  tiles[idx].classList.add('animated');
  tiles[idx].style.boxShadow = '0 0 0 4px #FFD700, 0 10px 30px var(--glow)';
  setTimeout(() => { tiles[idx].style.boxShadow = ''; }, 1200);
};

// Переключатель темы
function setTheme(light) {
  document.documentElement.setAttribute('data-theme', light ? 'minimal-light' : 'minimal-dark');
  themeToggle.textContent = light ? '🌞' : '🌙';
}
themeToggle.onclick = () => {
  setTheme(document.documentElement.getAttribute('data-theme') !== 'minimal-light');
};
// По умолчанию — тёмная
setTheme(false);

// Фейковый чат
// --- 1000 уникальных никнеймов ---
function generateUniqueNicks(count) {
  const base = [
    'eden', 'core', 'stream', 'pro', 'tv', 'ru', 'bot', 'girl', 'boy', 'fan', 'vip', 'lol', 'xd', 'official', '247', 'random', 'user', 'gamer', 'king', 'queen', 'night', 'day', 'cat', 'dog', 'fox', 'wolf', 'bear', 'lion', 'tiger', 'dragon', 'ninja', 'samurai', 'cyber', 'neo', 'dark', 'light', 'fire', 'ice', 'gold', 'silver', 'diamond', 'platinum', 'iron', 'steel', 'shadow', 'ghost', 'angel', 'devil', 'joker', 'smile', 'happy', 'sad', 'crazy', 'fast', 'slow', 'big', 'small', 'mega', 'mini', 'ultra', 'super', 'hyper', 'max', 'min', 'pro', 'noob', 'top', 'best', 'worst', 'first', 'last', 'next', 'prev', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero', 'alpha', 'beta', 'omega', 'delta', 'sigma', 'prime', 'plus', 'minus', 'x', 'z', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'c', 'v', 'b', 'n', 'm'
  ];
  const nicks = new Set();
  while (nicks.size < count) {
    const parts = [
      base[Math.floor(Math.random() * base.length)],
      base[Math.floor(Math.random() * base.length)],
      Math.random() < 0.3 ? base[Math.floor(Math.random() * base.length)] : ''
    ].filter(Boolean);
    const num = Math.random() < 0.8 ? Math.floor(Math.random() * 10000) : '';
    const sep = Math.random() < 0.5 ? '_' : '';
    const cap = Math.random() < 0.5 ? s => s.charAt(0).toUpperCase() + s.slice(1) : s => s;
    const nick = parts.map(cap).join(sep) + num;
    nicks.add(nick);
  }
  return Array.from(nicks);
}
const fakeNicks = generateUniqueNicks(1000);

// --- 1000 уникальных сообщений ---
function generateUniqueMsgs(count) {
  const templates = [
    'Вау, какой топовый стрим!', 'Кто тут из СНГ?', 'Лайк за оформление!', '24/7 — это круто!', 'Где чатик активнее?', 'Погнали в дискорд!', 'Кто за кого болеет?', 'А есть тут PUBG?', 'CS2 forever!', 'Rust топ!', 'Всем привет!', 'Сколько тут зрителей?', 'Кто с мобилы?', 'Где донаты? 😅', 'Поставьте лайк!',
    'Только зашёл, что тут происходит?', 'Кто-нибудь видел вчерашний стрим?', 'Тут всегда так лампово?', 'Модеры, привет!', 'Погнали рейдить!', 'Кто из Казахстана?', 'Где найти расписание?', 'А стример читер? 😂', 'Сколько тут подписчиков?', 'Кто в топе по донатам?', 'Где мемы?', 'Пацаны, кто в дс?', 'Тут есть девушки?', 'Когда розыгрыш?', 'Где мой кофе?',
    'Погнали катку?', 'Кто зашёл с работы?', 'Смотрю с телевизора!', 'А тут можно спамить?', 'Где смайлы?', 'Кто из Питера?', 'Всем чата добра!', 'Тут есть кто из 2000-х?', 'Кто на ночь глядя?', 'Где найти клипы?', 'А тут есть VIP?', 'Кто-нибудь играет в шахматы?', 'Где найти старые записи?', 'Кто тут ради музыки?', 'Где найти merch?'
  ];
  const emojis = ['🔥','😂','😅','😎','👍','👀','💯','🥇','🥳','🤔','😱','😴','🤡','🎉','🎮','🎵','💬','🦄','🦊','🐱','🐶','🍕','🍔','🍟','🍿','🥤','🍺','🍻','🥃','🍷','🍸','🍹','🥂','☕','🍩','🍪','🍫','🍦','🍰','🎂','🍓','🍒','🍉','🍇','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🥝','🥑','🥦','🥕','🌽','🌶️','🥒','🥬','🥔','🍠','🥚','🍳','🥞','🧇','🥓','🥩','🍗','🍖','🌭'];
  const tails = ['лол','ахах','xd',':D',';)',':)',';D','!','!!','!!!','?','??','???','...',')))','((',':3','<3','<333','^_^','¯\\_(ツ)_/¯','( ͡° ͜ʖ ͡°)'];
  const base = [
    'Кто в катку?', 'Го в дс!', 'Тут есть кто живой?', 'Когда следующий стрим?', 'Где найти расписание?', 'Кто тут ради мемов?', 'Погнали в паблик!', 'Кто тут ради музыки?', 'Где найти топ-донатера?', 'Кто тут ради общения?', 'Где найти ссылку на группу?', 'Кто тут ради розыгрыша?', 'Где найти расписание игр?', 'Где найти топ-чат?', 'Кто тут ради фана?', 'Где найти топ-стримера?'
  ];
  const msgs = new Set();
  let i = 0;
  while (msgs.size < count) {
    let msg = '';
    if (i < templates.length) {
      msg = templates[i];
    } else {
      const b = base[Math.floor(Math.random() * base.length)];
      const emoji = Math.random() < 0.7 ? emojis[Math.floor(Math.random() * emojis.length)] : '';
      const num = Math.random() < 0.25 ? ' ' + Math.floor(Math.random() * 10000) : '';
      const tail = Math.random() < 0.5 ? ' ' + tails[Math.floor(Math.random()*tails.length)] : '';
      msg = b + emoji + num + tail;
      // Добавим вариативности
      if (Math.random() < 0.3) msg = emoji + ' ' + b + tail;
      if (Math.random() < 0.2) msg = b.toUpperCase() + tail + emoji;
    }
    msgs.add(msg);
    i++;
  }
  return Array.from(msgs);
}
const fakeMsgs = generateUniqueMsgs(1000);
function addFakeChatMsg() {
  const nick = fakeNicks[Math.floor(Math.random() * fakeNicks.length)];
  const msg = fakeMsgs[Math.floor(Math.random() * fakeMsgs.length)];
  const el = document.createElement('div');
  el.className = 'fake-chat-message';
  el.innerHTML = `<span class="fake-chat-nick">${nick}:</span> <span class="fake-chat-text">${msg}</span>`;
  fakeChatMessages.appendChild(el);
  fakeChatMessages.scrollTop = fakeChatMessages.scrollHeight;
  // Ограничение на 40 сообщений
  if (fakeChatMessages.children.length > 40) fakeChatMessages.removeChild(fakeChatMessages.firstChild);
}
setInterval(addFakeChatMsg, 1800);
for (let i = 0; i < 10; ++i) addFakeChatMsg();

// Первичный рендер
renderStreams();
lastUpdate = Date.now();
updateStatTime();