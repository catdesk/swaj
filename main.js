
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var w = 700;
var h = 500;
var globalTime = 0;
var timer = 0;
var otime = Date.now();
var dtime = 0;
var ntime = 0;

var score = 10;
var scoreBoard = document.getElementById('score');
scoreBoard.innerHTML = score;

var gameState = 'play';

var angle = 1;

var shark = {
  w: 90,
  h: 120,
  x: 0
};

var bhouse = {
  w: 180,
  h: 80,
  x: 0,
  y: 40,
  s: 1,
  counter: 0
}

var human = {
  x: 0,
  y: 0,
  w: 18,
  h: 30,
  v: 2,
  isFlying: false,
  lock: false
}

canvas.width = w;
canvas.height = h;

var toRadians = Math.PI/180;

var draw = function() {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeRect(shark.x, h - shark.h, shark.w, shark.h);
  ctx.fillRect(human.x, h -Math.floor(human.y), human.w, human.h);
  ctx.strokeRect(bhouse.x, bhouse.y, bhouse.w, bhouse.h);
}

var updateHuman = function() {
  if (human.isFlying === true) {

    human.y = human.y + human.v;

    if (human.y > shark.h) {
      human.lock = true;
    }

    if (human.lock === false) {
      human.x = shark.x + shark.w / 2 - human.w / 2;
    }

    if (human.y > h) {
      resetHuman();
    }
  } else {
    calcHumanInterval();
  }
}

var calcHumanInterval = function() {
  var interval = 1000;

  var hop = globalTime % interval;
  if (globalTime > 1000) {
    if (hop <= 100) {
      human.isFlying = true;
      human.lock = false;
    }
  }
}

var resetHuman = function() {
  human.isFlying = false;
  human.y = 0;
  human.x = shark.x;
}

var updateBHouse = function() {
  if (bhouse.x > w - bhouse.w || bhouse.x < 0) {
    bhouse.s = bhouse.s * -1
  }
  bhouse.x = bhouse.x + bhouse.s
}

var updateTime = function() {
  ntime = Date.now();
  dtime = ntime - otime;
  globalTime = globalTime + dtime;
  otime = ntime;

  document.getElementById('time').innerHTML = globalTime;
}

var updateCollision = function() {

  if (human.y > (h - (bhouse.y +  bhouse.h))) {
    if (human.x > bhouse.x && human.x < bhouse.x + bhouse.w) {
      resetHuman();
      score = score -1;
      scoreBoard.innerHTML = score;
      if (score <= 0) {
        gameState = 'party';
      }
    }
  }
}

var update = function() {

  if (gameState === 'play') {
    updateTime();
    updateHuman();
    updateBHouse();
    updateCollision();
  }
  if (gameState === 'party') {
    document.querySelector('body').innerHTML = "It's a party!";
  }
}

var loop = function() {
  update();
  draw();
  window.requestAnimationFrame(loop);
}

var raf = window.requestAnimationFrame(loop);


window.addEventListener('load', function() {

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDIInit, onMIDISystemError);
  } else {
    alert('Your broswer does not support WebMIDI. You can use the keyboard instead.');

    window.addEventListener('keypress', function(ev) {
      switch(ev.key) {
        case 'd':
          shark.x = (w/7) * 0;
          break;
        case 'f':
          shark.x = (w/7) * 1;
          break;
        case 'g':
          shark.x = (w/7) * 2;
          break;
        case 'h':
          shark.x = (w/7) * 3;
          break;
        case 'j':
          shark.x = (w/7) * 4;
          break;
        case 'k':
          shark.x = (w/7) * 5;
          break;
        case 'l':
          shark.x = (w/7) * 6;
          break;
      }
    });
  }


});


var keyboard, data;

var midiMessageReceived = function(ev) {

  data = ev.data;
  cmd = data[0];
  note = data[1];

  if (cmd === 144) {
    switch(note) {
      case 53:
        shark.x = (w/7) * 0;
        break;
      case 55:
        shark.x = (w/7) * 1;
        break;
      case 57:
        shark.x = (w/7) * 2;
        break;
      case 59:
        shark.x = (w/7) * 3;
        break;
      case 60:
        shark.x = (w/7) * 4;
        break;
      case 62:
        shark.x = (w/7) * 5;
        break;
      case 64:
        shark.x = (w/7) * 6;
        break;
    }
  }
}

var onMIDIInit = function(midi) {
  for (var input of midi.inputs.values()) {
    if (input.name === 'LPK25 MIDI 1') {
      alert(input.name + ' found! Ready to go!');
      keyboard = input;
      keyboard.onmidimessage = midiMessageReceived;
    }
  }
}

var onMIDISystemError = function(error) {
  console.log(error);
}
