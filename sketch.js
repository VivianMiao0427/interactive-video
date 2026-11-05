// This is a test of the p5LiveMedia webrtc library and associated service.
// Open this sketch up 2 times to send video back and forth

let myVideo;
let p5l;
let myName = "";
let others = {};

connect.addEventListener('click', function(e) {
  connectionStuff(roomName.value);
})

function setup() {
  cnv = createCanvas(800, 500);
  cnv.parent(videoStuff);
}

function connectionStuff(room) {
  myName = userName.value.trim() || "Guest";

  myVideo = createCapture({ video: true, audio: true },
    function(stream) {
      p5l = new p5LiveMedia(this, "CAPTURE", stream, room);
      p5l.on('stream', gotStream);
      p5l.on('data', gotData);
      p5l.on('disconnect', gotDisconnect);
    }
  );
  myVideo.elt.muted = true;
  myVideo.hide();
}

function draw() {
  background(173, 216, 230);
  drawScene();

  if (p5l && frameCount % 60 === 0) {
    p5l.send(myName);
  }

  let list = getParticipants();
  let n = list.length;
  if (n === 0) return;

  let spacing = width / n;
  let d = min(210, spacing - 20);

  for (let i = 0; i < n; i++) {
    let bob = sin(frameCount * 0.03 + i * 2) * 8;
    bubbleVideo(list[i].video, spacing * (i + 0.5), 15 + d / 2 + bob, d, list[i].name);
  }
}

function getParticipants() {
  let list = [];

  if (myVideo) {
    let myId = (p5l && p5l.socket && p5l.socket.id) || "me";
    list.push({ id: myId, video: myVideo, name: myName });
  }

  for (let id in others) {
    if (others[id].video) {
      list.push({ id: id, video: others[id].video, name: others[id].name || "..." });
    }
  }

  list.sort(function(a, b) { return a.id < b.id ? -1 : 1; });
  return list;
}

function gotStream(stream, id) {
  if (!others[id]) others[id] = {};
  others[id].video = stream;
  stream.hide();
  stream.elt.muted = false;
  let p = stream.elt.play();
  if (p) p.catch(function() {});
}

function gotData(data, id) {
  if (!others[id]) others[id] = {};
  others[id].name = data;
}

function gotDisconnect(id) {
  delete others[id];
}

function bubbleVideo(v, cx, cy, d, label) {
  let r = d / 2;
  let aspect = (v.width && v.height) ? v.width / v.height : 4 / 3;
  let w = d * aspect;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(cx, cy, r, 0, TWO_PI);
  drawingContext.clip();
  image(v, cx - w / 2, cy - r, w, d);
  drawingContext.restore();

  noFill();
  stroke(255, 200);
  strokeWeight(4);
  ellipse(cx, cy, d, d);

  noStroke();
  fill(255);
  textSize(14);
  textAlign(CENTER);
  text(label, cx, cy + r + 20);
  textAlign(LEFT);
}

function drawScene() {
  noStroke();
  fill(238, 220, 170);
  rect(0, 470, width, 30);

  seaweed(70, 110, color(60, 160, 80));
  seaweed(110, 80, color(40, 130, 70));
  seaweed(250, 70, color(80, 180, 90));
  seaweed(560, 70, color(80, 180, 90));
  seaweed(690, 80, color(40, 130, 70));
  seaweed(730, 110, color(60, 160, 80));

  pineappleHouse(400, 490);
}

function seaweed(x, h, c) {
  noFill();
  stroke(c);
  strokeWeight(8);
  strokeCap(ROUND);
  beginShape();
  for (let i = 0; i <= 8; i++) {
    let sway = sin(frameCount * 0.04 + i * 0.6 + x) * i * 2;
    vertex(x + sway, 485 - (i * h) / 8);
  }
  endShape();
}

function pineappleHouse(x, groundY) {
  let w = 150;
  let h = 200;
  let cy = groundY - h / 2;

  noStroke();
  fill(60, 150, 50);
  for (let a = -50; a <= 50; a += 25) {
    push();
    translate(x, groundY - h + 10);
    rotate(radians(a));
    ellipse(0, -40, 26, 100);
    pop();
  }

  fill(240, 130, 30);
  stroke(150, 50, 20);
  strokeWeight(3);
  ellipse(x, cy, w, h);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.ellipse(x, cy, w / 2, h / 2, 0, 0, TWO_PI);
  drawingContext.clip();
  strokeWeight(2);
  for (let i = -300; i < 300; i += 45) {
    line(x + i, groundY - h, x + i + h, groundY);
    line(x + i + h, groundY - h, x + i, groundY);
  }
  drawingContext.restore();

  stroke(110, 110, 200);
  strokeWeight(5);
  fill(150, 200, 230);
  ellipse(x - 35, cy - 10, 30, 30);
  ellipse(x + 38, cy + 30, 26, 26);

  fill(130, 130, 210);
  stroke(90, 90, 170);
  strokeWeight(3);
  rect(x - 20, groundY - 62, 40, 62, 20, 20, 0, 0);
  noStroke();
  fill(90, 90, 170);
  ellipse(x, groundY - 32, 8, 8);
}