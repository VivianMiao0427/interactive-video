// This is a test of the p5LiveMedia webrtc library and associated service.
// Open this sketch up 2 times to send video back and forth

let myVideo;
let otherVideo;
let theRoom;

let constraints = {audio: true, video: true};

connect.addEventListener('click', function(e) {
    connectionStuff(roomName.value)
})

function setup() {
  cnv = createCanvas(400, 400);
    cnv.parent(videoStuff)
}

function connectionStuff(roomName) {
    myVideo = createCapture(constraints, 
      function(stream) {
        let p5l = new p5LiveMedia(this, "CAPTURE", stream, roomName);
        p5l.on('stream', gotStream);
      }
    );  
    myVideo.muted = true;     
    myVideo.hide();
}


function draw() {
  background(220);
  stroke(255);
  if (myVideo != null) {
    image(myVideo,0,0,width/2,height);
    text("My Video", 10, 10);
  }
  

  if (otherVideo != null) {
    image(otherVideo,width/2,0,width/2,height);
    text("Their Video", width/2+10, 10);
  }  
}

// We got a new stream!
function gotStream(stream, id) {
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  //otherVideo.id and id are the same and unique identifiers
  otherVideo.hide();
}