import './styles.css';

const steps = {
  inhale: 6,
  inhaleHold: 0,
  exhale: 6,
  exhaleHold: 0
};
let isBreathing = false;
let enableSound = true;
let enableDebug = false;

const startText = 'เริ่มหายใจ (คลิ๊ก)';

function debug() {
  if (enableDebug) {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
}

function setupFromHash() {
  const params = window.location.hash.substr(1).split(',');
  if (params.length !== 4) {
    console.log('use default', steps);
    return;
  }
  let i = 0;
  for (const step in steps) {
    steps[step] = parseFloat(params[i]);
    i += 1;
  }
  soundInhale.release = steps.inhale + 0.1;
  soundExhale.release = steps.exhale + 0.1;
  console.log('setupFromHash', steps);
}

function $(id) {
  return document.getElementById(id);
}

function clock(second) {
  let remain = second;
  const tick = () => {
    if (!isBreathing) {
      $('clock').innerText = '';
      return;
    }
    $('clock').innerText = remain;
    remain -= 1;
    if (remain > 0) setTimeout(() => tick(), 1000);
  };
  tick();
}

function setAnimationDuration(second) {
  const jit = $('jit');
  jit.style['animation-duration'] = jit.style.animationDuration = `${second}s`;
}

function inhale() {
  if (!isBreathing) {
    return;
  }
  debug('inhale');
  $('jit').className = 'inhale';
  setAnimationDuration(steps.inhale);
  $('text').innerText = 'หายใจเข้า';
  if (steps.inhaleHold === 0) {
    setTimeout(exhale, steps.inhale * 1000);
  } else {
    setTimeout(inhaleHold, steps.inhale * 1000);
  }
  clock(steps.inhale);
  soundInhaleHit();
}
function inhaleHold() {
  if (!isBreathing) {
    return;
  }
  debug('inhale-hold');
  $('jit').className = 'inhaleHold';
  setAnimationDuration(steps.inhaleHold);
  $('text').innerText = 'เก็บลม';
  clock(steps.inhaleHold);
  setTimeout(exhale, steps.inhaleHold * 1000);
}
function exhale() {
  if (!isBreathing) {
    return;
  }
  debug('exhale');
  $('jit').className = 'exhale';
  setAnimationDuration(steps.exhale);
  $('text').innerText = 'หายใจออก';

  if (steps.exhaleHold === 0) {
    setTimeout(inhale, steps.exhale * 1000);
  } else {
    setTimeout(exhaleHold, steps.exhale * 1000);
  }
  clock(steps.exhale);
  soundExhaleHit();
}
function exhaleHold() {
  if (!isBreathing) {
    return;
  }
  debug('exhale-hold');
  $('jit').className = 'exhaleHold';
  setAnimationDuration(steps.exhaleHold);
  $('text').innerText = 'เก็บลม';
  clock(steps.exhaleHold);
  setTimeout(inhale, steps.exhaleHold * 1000);
}

function toggleBreathing() {
  isBreathing ? stop() : start();
}

function start() {
  if (isBreathing) return;
  isBreathing = true;
  inhale();
}

function stop() {
  isBreathing = false;
  $('jit').className = '';
  $('text').innerText = startText;
  $('clock').innerText = '';
}

const reverb = new Pizzicato.Effects.Reverb({
  time: 0.01,
  decay: 0.01,
  reverse: false,
  mix: 0.5
});
const soundInhale = new Pizzicato.Sound({
  source: 'wave',
  options: {
    frequency: 432
  }
});
soundInhale.attack = 0;
soundInhale.release = 6;
// soundInhale.addEffect(reverb);
function soundInhaleHit() {
  if (!enableSound) return;
  soundInhale.play();
  setTimeout(() => soundInhale.stop(), steps.inhale);
}

const soundExhale = new Pizzicato.Sound({
  source: 'wave',
  options: {
    frequency: 432
  }
});
soundExhale.attack = 0;
soundExhale.release = 6;
// soundExhale.addEffect(reverb);
function soundExhaleHit() {
  if (!enableSound) return;
  soundExhale.play();
  setTimeout(() => soundExhale.stop(), steps.exhale);
}

setupFromHash();
window.onhashchange = setupFromHash;

function SoundToggle() {
  const isOn = $('soundToggle').attributes.data.value === 'off' ? false : true;
  if (isOn) {
    $('soundToggle').attributes.data.value = 'off';
    $('soundToggle').innerText = '🔕';
    enableSound = false;
  } else {
    $('soundToggle').attributes.data.value = 'on';
    $('soundToggle').innerText = '🔔';
    enableSound = true;
  }
}

export default function App() {
  return (
    <div className="App">
      <a href="#6,6,0,0" alt="หายใจเข้า 6 วินาที / ออก 6 วินาที">
        Basic Breathing
      </a>{' '}
      |{' '}
      <a
        href="#6,4,6,4"
        alt="หายใจเข้า 6 วินาที / เก็บลม 4 วินาที / หายใจออก 6 วินาที / เก็บลม 4 วินาที "
      >
        Basic Pranayama
      </a>{' '}
      | <a href="#6,6,6,0">เก็บลมเข้า 6</a> | <a href="#6,6,0,6">เก็บลมออก 6</a>
      |{' '}
      <a id="soundToggle" onClick={SoundToggle} data="on">
        🔔
      </a>
      <div id="jit" onClick={toggleBreathing}>
        <div id="clock"></div>
        <div id="text">{startText}</div>
      </div>
    </div>
  );
}
