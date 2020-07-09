var myGamePiece;
var movingObstacles = [];
var wallL;
var wallR;
var wallT;
var wallB;
var obstFreq;
var totalScore;
var level;

function startGame() {
    obstFreq = 500;
    totalScore = 0;
    level = 1;
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById("Directions").style.display = "inline";
    document.getElementById("Score").style.display = "inline";
    document.getElementById("Frequency").style.display = "inline";
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", 385, 385);
    wallL = new component(10, 800, "blue" , 0, 0);
    wallR = new component(10, 800, "blue" , 790, 0);
    wallT = new component(800, 10, "blue" , 0, -40);
    wallB = new component(800, 10, "blue" , 0, 810);
    finishLine = new component(800, 30, "yellow", 0, 770);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 0;
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.which || e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function updateGameArea() {
  var x, y;
  for (i = 0; i < movingObstacles.length; i += 1){
    if (myGamePiece.crashWith(movingObstacles[i])) {
      myGamePiece.y = (movingObstacles[i].y-30);
    }
    else if (myGamePiece.crashWith(wallL)) {
      myGameArea.clear();
      myGameArea.frameNo = 0;
      wallL.update();
      wallR.update();
      wallT.update();
      wallB.update();
      finishLine.update();
      myGamePiece.x = 385;
      myGamePiece.y = 385;
      movingObstacles = [];
      myGamePiece.update();
      return;
    }
    else if (myGamePiece.crashWith(wallR)) {
      myGameArea.clear();
      myGameArea.frameNo = 0;
      wallL.update();
      wallR.update();
      wallT.update();
      wallB.update();
      finishLine.update();
      myGamePiece.x = 385;
      myGamePiece.y = 385;
      movingObstacles = [];
      myGamePiece.update();
      return;
    }
    else if (myGamePiece.crashWith(wallT)) {
      myGameArea.clear();
      myGameArea.frameNo = 0;
      wallL.update();
      wallR.update();
      wallT.update();
      finishLine.update();
      myGamePiece.x = 385;
      myGamePiece.y = 385;
      movingObstacles = [];
      myGamePiece.update();
      myGameArea.stop();
      document.getElementById("restart").style.display = "inline";
      return;
    }
    else if (myGamePiece.crashWith(wallB)) {
      myGameArea.clear();
      totalScore = (totalScore + myGameArea.frameNo);
      myGameArea.frameNo = 0;
      wallL.update();
      wallR.update();
      wallT.update();
      wallB.update();
      finishLine.update();
      myGamePiece.x = 385;
      myGamePiece.y = 385;
      movingObstacles = [];
      obstFreq = Math.round(obstFreq*.8);
      myGamePiece.update();
      level++;
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(obstFreq)) {
    y = myGameArea.canvas.height;
    minWidth = 150;
    maxWidth = 700;
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
    minGap = 40;
    maxGap = 50;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    movingObstacles.push(new component(width, 10, "green", 0, y));
    movingObstacles.push(new component( y - width - gap, 10, "green", width + gap, y));
  }
  if (level == 1){
    document.getElementById("lvlScore").style.display = "none";
    totalScore = myGameArea.frameNo;
  }
  else{
    document.getElementById("lvlScore").style.display = "inline";
  }
  document.getElementById("Score").innerHTML = "Total Score: " + totalScore;
  document.getElementById("lvlScore").innerHTML = "Level Score: " + myGameArea.frameNo;
  document.getElementById("Frequency").innerHTML = "Obstacle Frequency: " + obstFreq;
  finishLine.update();
  wallT.update();
  wallB.update();
  for (i=0; i < movingObstacles.length; i += 1){
    movingObstacles[i].y += -1;
    movingObstacles[i].update();
  }
  wallL.update();
  wallR.update();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -3; }
  if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 3; }
  if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -3; }
  if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 3; }
  myGamePiece.newPos();
  myGamePiece.update();
}
