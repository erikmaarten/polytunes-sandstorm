Template.body.helpers({
    isLogged: ()=> !Session.get('authorization') ? false : true
})

Template.board.helpers({
  rows: function () {
    if (!Session.get('room')) {
      let room = Rooms.findOne();
      console.log(room);

      for (let i = 0; i < room.board.width; i++) {
        let row = [];
        for (let j = 0; j < room.board.height ; j++) {
          row.push(cell(i, j));
        }
        room.partition.push(row);
      }
      Session.set('room', room);
    }
    return Session.get('room').partition;
  },
});

Template.login.events({
  'submit #login-form': event => {
    event.preventDefault();

    const surname = event.target.surname.value;
    const color = event.target.color.value;
    const roomId = Rooms.findOne()._id;

    Meteor.call('addUser', roomId, { surname, color});
    Session.set('authorization', "true");
    return false;
  }
});

Template.board.events({
  'click td': function (event, template) {
    let x = $(event.target).data('x');
    let y = $(event.target).data('y');

    let room = Session.get('room');
    room.partition[x][y].i = !room.partition[x][y].i;

    Session.set('room', room);
  },
});

Template.controls.events({
  'click #play': function (event, template) {
    togglePlay();
  }
});

function cell(x, y, userId) {
  return {
    x: x || 0,
    y: y || 0,
    frequency: 200,
    title: 200,
    timestamp: new Date(),
    userId: userId || '',
    i: false,
  }
}

let togglePlay = (function() {
  let handler = -1;
  return function() {
    if (handler === -1) {
      console.debug('play');
      handler = setInterval(function () {
        console.debug('tick');
        play();
      }, noteDuration());
    } else {
      clearInterval(handler);
      handler = -1;
    }
  }
})();

function play () {
  let room = Session.get('room');

  if (cursor > room.board.width) {
    cursor = 0;
  }

  // $('td').removeClass('p p1 p2');

  for(let y = 0; y < room.board.height+1; y++) {
    console.log('cursor', cursor);
    console.log('y', y);
    let cell = room.partition[cursor][y];
    if (cell.i) {
      cell.p = true;
      // visualEffect(cell);
      playNote(cell.note);
    }
  }

  cursor++;
}

function noteDuration() {
  return 60 / Session.get('room').tempo * 1000 / 4;
}

var cursor = 0;

var oscillator = new Array();
var wave = "sine";

// Audio Context
var context = new (window.AudioContext || window.webkitAudioContext);

// Play note from oscillator
function playNote(frequency) {
  var i = Math.random(0,10000);

  // Create OscillatorNode
  oscillator[i] = context.createOscillator(); // Create sound source
  oscillator[i].type = wave; // Wave form
  oscillator[i].frequency.value = frequency; // Frequency in hertz
  // Connect the Nodes
  oscillator[i].connect(context.destination); // Connect gain to output
  oscillator[i].start(0); // Play oscillator[i] instantly
  setTimeout(function() {
    oscillator[i].stop(0);
  }, noteDuration());

  // var now = context.currentTime;
  // oscillator[i].start(now + 0);
  // oscillator[i].stop(now + noteDuration());
}
