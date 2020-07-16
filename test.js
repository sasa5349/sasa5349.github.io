var myGamePiece;
var movingObstacles = [];
var wallLeft;
var wallRight;
var wallTop;
var wallBottom;
var obstFreq;
var totalScore;
var level;
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

function startGame() {
    console.log('New game started.');
    obstFreq = 200; //Obstacle Frequency
    totalScore = 0; //Total Score throughout all levels
    level = 1;      //Level counter
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById("Directions").style.display = "inline";
    document.getElementById("Score").style.display = "inline";
    document.getElementById("Frequency").style.display = "inline";
    myGameArea.start();
    myGamePiece = new component(30, 30, '#d1477c', 385, 200);
    finishLine = new component(900, 30, '#ccff00', -50, 770);
    wallTop = new component(900, 10, "red" , -50, -7);
    wallLeft = new component(10, 900, "black" , 0, -50);
    wallRight = new component(10, 900, "black" , 790, -50);
    wallBottom = new component(900, 10, "black" , 0, 810);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
      //myGameArea.canvas refers to this canvas just created
    start: function() {
        console.log('Game area created.');
      //myGameArea.start refers to this function that starts the canvas
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 0;
        window.onkeydown = function(e){
             var kc = e.keyCode;
             if(kc === 37) keys.left = true;
             if(kc === 38) keys.up = true;
             if(kc === 39) keys.right = true;
             if(kc === 40) keys.down = true;
         };
        window.onkeyup = function(e){
             var kc = e.keyCode;
             if(kc === 37) keys.left = false;
             if(kc === 38) keys.up = false;
             if(kc === 39) keys.right = false;
             if(kc === 40) keys.down = false;
        };
    },
    clear: function(){
      //myGameArea.clear refers to this function that clears the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
      //myGameArea.stop refers to this function that clears the interval
        clearInterval(this.interval);
    }
}

var hiScore ={
  score: 0,
  level: 0
};

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
    this.move = function(){
      var speed = 2*(1 +(level*.05))
      if(keys.up){
          myGamePiece.y -= speed;
      }
      if(keys.down){
          myGamePiece.y += speed;
      }
      if(keys.left) {
          myGamePiece.x -= speed*1.15;
      }
      if(keys.right){
          myGamePiece.x += speed*1.5;
      }
      return speed;
    }
    return crash;
  }
}

function updateGameArea() {
  for (i = 0; i < movingObstacles.length; i += 1){  //Collision with a moving barrier
    if (myGamePiece.crashWith(movingObstacles[i])) {
      myGamePiece.y = (movingObstacles[i].y-30);
      // console.log('barrier collision');
    }
  }
  if (myGamePiece.crashWith(wallLeft)) {            //Collision with Left wall
    myGamePiece.x = 10;
    // console.log('barrier collision');
  }
  else if (myGamePiece.crashWith(wallRight)) {      //Collision with Right wall
    myGamePiece.x = 760;
    // console.log('barrier collision');
  }
  else if (myGamePiece.crashWith(wallTop)) {        //Collision with top (Game Over)
    console.log('barrier collision, GAME OVER');
    myGameArea.clear();
    myGameArea.frameNo = 0;
    finishLine.update();
    wallTop.update();
    wallLeft.update();
    wallRight.update();
    wallBottom.update();
    myGamePiece.x = 385;
    myGamePiece.y = 200;
    movingObstacles = [];
    myGamePiece.update();
    myGameArea.stop();
    document.getElementById("restart").style.display = "inline";
    if (hiScore.score == 0){
      console.log('case 1: Score was already 0, scores change');
      hiScore.score = totalScore;
      hiScore.level = level;
    }
    else if (level > hiScore.level){
      hiScore.score = totalScore;
      hiScore.level = level;
      console.log('case 4: Better level, scores change');
    }
    else if (level < hiScore.level){
      hiScore.score = hiScore.score;
      hiScore.level = hiScore.level;
      console.log('case 3: Worse level, NO CHANGE');
    }
    else if (totalScore < hiScore.score && level >= hiScore.level){
      hiScore.score = totalScore;
      hiScore.level = level;
      console.log('case 2: Better score, Better level, scores change');
    }
    document.getElementById("HiScore").style.display = "inline";
    document.getElementById("HiScore").innerHTML = "Best Score: " + hiScore.score + " on Level " + hiScore.level;
    return;
  }
  else if (myGamePiece.crashWith(wallBottom)) {     //Collision with bottom (Next Level)
    console.log('Level Complete!! NEXT LEVEL LOADING');
    myGameArea.clear();
    totalScore = (totalScore + myGameArea.frameNo);
    myGameArea.frameNo = 0;
    finishLine.update();
    wallTop.update();
    wallLeft.update();
    wallRight.update();
    wallBottom.update();
    myGamePiece.x = 385;
    myGamePiece.y = 200;
    movingObstacles = [];
    if (obstFreq >= 100){
      obstFreq -= 7.5;
    }
    else {
      obstFreq -= 5;
    }
    myGamePiece.update();
    level++;
    return;
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(obstFreq)) {   //At the start, or every interval
    console.log('New obstacle pushed. Another one coming in ',obstFreq,' pixels.');
    console.log('obstacle speed: ', 1 +(level*.05), '. Your speed: ', myGamePiece.move())
    y = myGameArea.canvas.height;
    minWidth = 150;
    maxWidth = 700;
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
    minGap = 40;
    maxGap = 160;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    movingObstacles.push(new component(width, 10, 'black', 0, y));
    movingObstacles.push(new component( y - width - gap, 10, 'black', width + gap, y));
  }
  document.getElementById("lvl").innerHTML = "Level " + level;
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
  wallTop.update();
  wallBottom.update();
  for (i=0; i < movingObstacles.length; i += 1){
    movingObstacles[i].y -= 1 +(level*.05);
    movingObstacles[i].update();
  }
  wallLeft.update();
  wallRight.update();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  myGamePiece.move();
  myGamePiece.update();
}
