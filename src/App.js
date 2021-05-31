import './styles.css';

const steps = {
  inhale: 6,
  exhale: 6,
  inhaleHold: 0,
  exhaleHold: 0
};

function setupFromHash() {
  const params = window.location.hash.substr(1).split(',');
  let i = 0;
  for (const step in steps) {
    steps[step] = parseFloat(params[i]);
    i += 1;
  }
  console.log('setupFromHash', steps);
}

function $(id) {
  return document.getElementById(id);
}

function inhale() {
  console.log('inhale');
  $('jit').className = 'inhale';
  $('jit').style.animationDuration = `${steps.inhale}s`;
  $('text').innerText = 'หายใจเข้า';
  if (steps.inhaleHold === 0) {
    setTimeout(exhale, steps.inhale * 1000);
  } else {
    setTimeout(inhaleHold, steps.inhale * 1000);
  }
}
function inhaleHold() {
  console.log('inhale-hold');
  $('jit').className = 'inhaleHold';
  $('jit').style.animationDuration = `${steps.inhaleHold}s`;
  $('text').innerText = 'เก็บลม';
  setTimeout(exhale, steps.inhaleHold * 1000);
}
function exhale() {
  console.log('exhale');
  $('jit').className = 'exhale';
  $('jit').style.animationDuration = `${steps.exhale}s`;
  $('text').innerText = 'หายใจออก';

  if (steps.exhaleHold === 0) {
    setTimeout(inhale, steps.exhale * 1000);
  } else {
    setTimeout(exhaleHold, steps.exhale * 1000);
  }
}
function exhaleHold() {
  console.log('exhale-hold');
  $('jit').className = 'exhaleHold';
  $('jit').style.animationDuration = `${steps.exhaleHold}s`;
  $('text').innerText = 'เก็บลม';
  setTimeout(inhale, steps.exhaleHold * 1000);
}

function start() {
  inhale();
}

setupFromHash();
window.onhashchange = setupFromHash;

export default function App() {
  return (
    <div className="App">
      <a href="#6,6,0,0">เข้าออก 6 วินาที</a> |{' '}
      <a href="#4,4,4,4">เข้าออก 4 เก็บลมเข้าออก 4</a>
      <div id="jit" onClick={start}>
        <div id="text"></div>
      </div>
    </div>
  );
}
