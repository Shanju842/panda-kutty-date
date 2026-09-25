const app = document.querySelector('#app');
const webhook = window.VITE_ACTIVITY_WEBHOOK_URL || '';
let screen = 1;
let noCount = 0;

function getSessionId() {
  let id = localStorage.getItem('panda-date-session');
  if (!id) {
    id = crypto.randomUUID?.() || `date-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem('panda-date-session', id);
  }
  return id;
}

function track(event) {
  const entry = { sessionId: getSessionId(), event, timestamp: new Date().toISOString() };
  try {
    const saved = JSON.parse(localStorage.getItem('panda-date-events') || '[]');
    localStorage.setItem('panda-date-events', JSON.stringify([...saved, entry]));
  } catch { /* never interrupt the invitation */ }
  if (webhook) {
    fetch(webhook, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
  body: JSON.stringify(entry),
  keepalive: true
}).catch(() => {});
  }
}

const button = (label, action, className = '') => `<button class="cta ${className}" data-action="${action}">${label}<span class="button-glow"></span></button>`;

function shell(content, pageClass = '') {
  app.innerHTML = `<div class="desktop-bg"></div><section class="phone ${pageClass}">
    <div class="aurora a1"></div><div class="aurora a2"></div>
    <div class="hearts" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i><i>✦</i><i>♥</i><i>✦</i></div>
    <div class="scene">${content}</div>
  </section>`;
  requestAnimationFrame(() => app.querySelector('.scene')?.classList.add('visible'));
}

function opening() {
  shell(`<div class="opening-content center">
    <div class="mail">💌</div><p class="eyebrow">a little something for you</p>
    <h1>Hey, <em>Panda Kutty…</em></h1>
    <p class="lead">There’s a very important<br>message for you.</p>
    <div class="push"></div>${button('OPEN IT ❤️', 'open')}
  </div>`, 'opening');
}

function notice() {
  shell(`<div class="stack notice-content">
    <p class="notice-tag">🚨 &nbsp;OFFICIAL NOTICE&nbsp; 🚨</p>
    <h2>You have been selected for an <em>extremely important mission.</em> ❤️</h2>
    <p>Unfortunately, you have no option to decline. 😌</p><p class="because">Because…</p>
    <h1 class="dramatic">I’M STEALING YOU<br>FOR A COMPLETE DAY.<br><span>🫵🏻❤️</span></h1>
    <div class="love-note"><p>Yes, Bubuu.</p><strong>A WHOLE DAY.</strong><p>Just you and me. 🥹❤️</p></div>
    <div class="mini-lines"><span>No rushing.</span><span>No “I have to go.”</span><span>No escaping.</span><span>Just us. 🫶🏻</span></div>
    ${button('CONTINUE ❤️', 'continue')}
  </div>`);
}

function memory() {
  shell(`<div class="stack memory-content">
    <p class="eyebrow">chapter two</p><h1>Remember this day? <em>🥹</em></h1>
    <div class="polaroid"><div class="photo-wrap"><img src="date-photo.jpg" alt="A beautiful memory together"></div><p>us, being us ♡</p></div>
    <div class="memory-copy"><p>Look at us…</p><p>That day was already so beautiful. ❤️</p><p class="warm">But I think we can do even better.</p></div>
    ${button('TELL ME MORE 🙈', 'tease')}
  </div>`, 'memory');
}

function teasing() {
  shell(`<div class="stack tease-content">
    <p class="eyebrow">a tiny preview</p><h1>Are you ready to make the next one even more beautiful? <em>👀</em></h1>
    <p>Because I have a feeling…</p><p class="special">this one is going to be a little more special. <em>😌❤️</em></p>
    <div class="reveal-list"><p>A little more laughing. ❤️</p><p>A little more teasing. 😏</p><p>A little more getting unnecessarily close. 👀</p></div>
    <div class="intimate"><p>And maybe…</p><strong>a few moments that are just for us. 😏❤️</strong></div>
    ${button('I’M READY 🙈', 'question')}
  </div>`);
}

function question() {
  const noCopy = noCount === 0 ? '' : noCount === 1 ? `<div class="no-message"><strong>Haan haan… 😂</strong><p>Nice try.</p><p>You really thought you could escape?</p><p>You’re coming with me. 😌❤️</p></div>` : noCount === 2 ? `<div class="no-message"><strong>Panda Kutty… seriously? 😭</strong><p>You’re still trying?</p><p>You know that isn’t going to work, right? 😂</p></div>` : `<div class="no-message final-no"><strong>Okay, Bubuu…</strong><p>You’ve officially run out of escape routes. 😌❤️</p><p>The NO button has been rejected.</p><p>And anyway…</p><p>I already have plans for you. 👀</p><p>Some are cute. 🥰</p><p>Some are romantic. ❤️</p><p>And some… probably shouldn’t be written here. 😏</p><p>Stop acting innocent, Panda Kutty. 😂❤️</p></div>`;
  shell(`<div class="question-content center"><div class="question-heart">♡</div><p class="eyebrow">the important part</p><h1>SO, <em>PANDA KUTTY…</em></h1><h2>Are you coming with me? 🥺❤️</h2>${noCopy}<div class="decision">${button('💗 YES, I’M COMING', 'yes', 'yes')}${noCount < 3 ? button('🙈 NO, I’M NOT COMING', 'no', 'no') : ''}</div></div>`, 'question');
}

function confirmed() {
  shell(`<div class="celebration" aria-hidden="true">${Array.from({length: 24}, (_, i) => `<b style="--i:${i}">${i % 3 === 0 ? '♥' : i % 3 === 1 ? '✦' : '•'}</b>`).join('')}</div><div class="stack confirmed-content center">
    <div class="confirmed-icon">🥰</div><p class="notice-tag">DATE CONFIRMED</p><h1>YAYYYYY <em>❤️</em></h1>
    <p class="big-copy">My Panda Kutty is officially coming with me.</p><p>One complete day.<br>Just us. 🫶🏻</p><p>And I promise…</p><p class="warm">I’m going to make it better than the last one. 🥹❤️</p>
    <div class="promise"><span>We’ll laugh.</span><span>We’ll eat.</span><span>We’ll take stupid pictures.</span><span>We’ll annoy each other.</span><span>We’ll get way too close. 😏</span></div>
    <p>And somewhere in between all of that…</p><p class="warm">we’ll make another memory that’s only ours. 🫶🏻</p>
    <div class="signoff"><strong>❤️ SEE YOU SOON, BUBUU.</strong><p>Your favourite person is coming to steal you.</p><p>And this time, you’re not escaping. 😌🫵🏻❤️</p><em>— Your kidnapper ❤️</em></div>
  </div>`, 'confirmed');
}

function go(next) {
  app.querySelector('.scene')?.classList.remove('visible');
  setTimeout(() => { screen = next; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 220);
}
function render() { [opening, notice, memory, teasing, question, confirmed][screen - 1](); }

app.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'open') { track('OPENED'); go(2); }
  if (action === 'continue') { track('CONTINUE'); go(3); setTimeout(() => track('PHOTO_VIEWED'), 300); }
  if (action === 'tease') go(4);
  if (action === 'question') { track('QUESTION_VIEWED'); go(5); }
  if (action === 'no') { noCount += 1; track(`NO_${noCount}`); render(); }
  if (action === 'yes') { track('YES'); track('DATE_CONFIRMED'); track('FINAL_SCREEN'); go(6); }
});

render();
