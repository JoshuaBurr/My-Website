
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) }; //sets callback which tells the computer to begin animation
  var canvas = document.createElement('canvas'); //develops the canvas which the below functions will run within
var width = 512;
var height = 265;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d'); //sets to 2d canvas
window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};
var step = function() { //sets the sting of functions that refreshes the page
  update();
  render();
  animate(step);
};
var update = function() { //runs the command
};

var render = function() { //
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
};
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}
Paddle.prototype.render = function() {
  context.fillStyle = "#FF0000";
  context.fillRect(this.x, this.y, this.width, this.height);
};
function Player() {
   this.paddle = new Paddle(502, 120, 6, 37);
}

function Computer() {
  this.paddle = new Paddle(10, 120, 6, 37);
}
Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 2;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FF0000";
  context.fill();
};
var player = new Player();
var computer = new Computer();
var ball = new Ball( 256, 132);

var render = function() {
  context.fillStyle = "#000000";//fills the canvas with a colour
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
};

var update = function() {
  ball.update();
};

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};
var update = function() {
  ball.update(player.paddle, computer.paddle);
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var leftofball = this.x - 5;// the five value comes from the radius of the ball
  var bottomofball = this.y - 5;
  var rightofball = this.x + 5;
  var topofball = this.y + 5;

  if(this.y - 5 < 0) {// bounce off bottom
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 265) {// bounce off top
    this.y = 260;
    this.y_speed = -this.y_speed;
  }

  if(this.x <0  || this.x > 512) {// lets the computer know when the ball goes past min/max x and y
    this.x_speed = -3;
    this.y_speed = 0;
    this.y = 132;
    this.x = 256;
  }

  if(rightofball < 265 ) {
    if(bottomofball < (paddle2.y + paddle2.height) &&// means that the bottom of the ball is less than the heighest point of paddle
     topofball > paddle2.y &&
      leftofball < (paddle2.x + paddle2.width) &&//menas that the left of the ball is less then  the lowest point of the paddle
       rightofball > paddle2.x) {

      this.x_speed = 3;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if(bottomofball < (paddle1.y + paddle1.height) &&
     topofball > paddle1.y &&
      leftofball < (paddle1.x + paddle1.width) &&
       rightofball > paddle1.x) {

      this.x_speed = -3;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});
var update = function() {
  player.update();
  ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) {
      this.paddle.move(0, -4);
    } else if (value == 40) {
      this.paddle.move(0, 4);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) {
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.width > 265) {
    this.y = 265 - this.width;
    this.y_speed = 0;
  }
}

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.y;
  var diff = -((this.paddle.y + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(0, diff);
  if(this.paddle.y < 0) {
    this.paddle.y = 0;
  } else if (this.paddle.x + this.paddle.height > 265) {
    this.paddle.x =  265-this.paddle.height;
  }
};
