

// The main loop.
const gameLoop = (game) => {
    let currentState = game.currentState();
    if(currentState) {

        //  Delta t is the time to update/draw.
        let dt = 1 / game.config.fps;

        //  Get the drawing context.
        let ctx = game.gameCanvas.getContext("2d");

        //  Update if we have an update function. Also draw
        //  if we have a draw function.
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }

};


class Ship  {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 62;
    this.height = 70;
  }
}


class Rocket {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
  }
}


class Bomb {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
  }
}


class Invader {
  constructor (x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 40;
    this.height = 40;
  }
}

// VanGogh image
let goghReady = false;
let goghImage = new Image();
goghImage.onload = () => {
	goghReady = true;
};
goghImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_62/v1485138973/van_gogh_bust_gpdqxv.png";

// Background image
let backgroundReady = false;
let backgroundImage = new Image();
backgroundImage.onload = () => {
	backgroundReady = true;
};
backgroundImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_800/v1485139498/Starry_Night2_znb8ym.jpg";

let sunflowerReady = false;
let sunflowerImage = new Image();
sunflowerImage.onload = () => {
	sunflowerReady = true;
};
sunflowerImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_40/v1485418344/sunflower_nyzhub.png";

let sunflower2Ready = false;
let sunflower2Image = new Image();
sunflower2Image.onload = () => {
	sunflower2Ready = true;
};
sunflower2Image.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_40/a_9/v1485418344/sunflower_nyzhub.png";

let paintReady = false;
let paintImage = new Image();
paintImage.onload = () => {
	paintReady = true;
};
paintImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/a_314/c_crop,h_400,w_55/c_scale,w_10/c_scale,w_10/v1485420453/brush_zc5s2v.png";

class Game {

  constructor() {

    this.config = {
      bombRate: 0.05,
      bombMinVelocity: 50,
      bombMaxVelocity: 50,
      invaderInitialVelocity: 25,
      invaderAcceleration: 0,
      invaderDropDistance: 20,
      rocketVelocity: 120,
      rocketMaxFireRate: 2,
      gameWidth: 700,
      gameHeight: 530,
      fps: 50,
      debugMode: false,
      invaderRanks: 5,
      invaderFiles: 10,
      shipSpeed: 120,
      levelDifficultyMultiplier: 0.2,
      pointsPerInvader: 5
    };

    // All state is in the variables below.
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.level = 1;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.score = 0;
    //  The state stack.
    this.stateStack = [];

    //  Input/output
    this.pressedKeys = {};
    this.gameCanvas =  null;

  }
  //  Initialis the Game with a canvas.
  initialize (gameCanvas) {

    //  Set the game canvas.
    this.gameCanvas = gameCanvas;

    //  Set the game width and height.
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    //  Set the state game bounds.
    this.gameBounds = {
      left: gameCanvas.width / 2 - this.config.gameWidth / 2,
      right: gameCanvas.width / 2 + this.config.gameWidth / 2,
      top: gameCanvas.height / 2 - this.config.gameHeight / 2,
      bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
  }

  //  Returns the current state.
  currentState () {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
  }

  moveToState (state) {

    //  Are we already in a state?
    if(this.currentState()) {

      //  Before we pop the current state, see if the
      //  state has a leave function. If it does we can call it.
      if(this.currentState().leave) {
        this.currentState().leave(game);
      }

      this.stateStack.pop();
    }

    //  If there's an enter function for the new state, call it.
    if(state.enter) {
      state.enter(game);
    }

    //  Set the current state.
    this.stateStack.push(state);
  }

  //  Start the Game.
  start () {

      //  Move into the 'welcome' state.
      this.moveToState(new WelcomeState());

      //  Set the game variables.
      this.lives = 3;
      this.config.debugMode = /debug=true/.test(window.location.href);

      //  Start the game loop.
      let game = this;
      this.intervalId = setInterval(function () { gameLoop(game);}, 1000 / this.config.fps);

  }

  //  Inform the game a key is down.
  keyDown (keyCode) {
     this.pressedKeys[keyCode] = true;
     //  Delegate to the current state too.
     if(this.currentState() && this.currentState().keyDown) {
         this.currentState().keyDown(this, keyCode);
     }
  }

  //  Inform the game a key is up.
  keyUp (keyCode) {
     delete this.pressedKeys[keyCode];
     //  Delegate to the current state too.
     if(this.currentState() && this.currentState().keyUp) {
         this.currentState().keyUp(this, keyCode);
     }
  }

}


class WelcomeState {

  draw (game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="50px 'Permanent Marker', cursive";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Van Gogh Invaders", game.width / 2, game.height/2 - 50);
    ctx.font="20px 'Permanent Marker', cursive";

    ctx.fillText("Press 'Space' to start.", game.width / 2, game.height/2);
    ctx.fillText("Use the arrow keys to move and 'Space' to shoot", game.width / 2, game.height/2 + 30);
  };

  keyDown (game, keyCode) {
    if(keyCode == 32) /*space*/ {
      //  Space starts the game.
      game.moveToState(new LevelIntroState(game.level));
    }
  };
}


class LevelIntroState {
    constructor(level){
      this.level = level;
      this.countdownMessage = "3";
    }

    draw (game, dt, ctx) {

      //  Clear the background.
      ctx.clearRect(0, 0, game.width, game.height);

      ctx.font="36px 'Permanent Marker', cursive";
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline="middle";
      ctx.textAlign="center";
      ctx.fillText("Level " + this.level, game.width / 2, game.height/2);
      ctx.font="24px 'Permanent Marker', cursive";
      ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);
    }

    update (game, dt) {

      //  Update the countdown.
      if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 secs
      }
      this.countdown -= dt;

      if(this.countdown < 2) {
        this.countdownMessage = "2";
      }
      if(this.countdown < 1) {
        this.countdownMessage = "1";
      }
      if(this.countdown <= 0) {
        //  Move to the next level, popping this state.
        game.moveToState(new PlayState(game.config, this.level));
      }
    }
}

class GameOverState {

  update (game, dt) {

  }

  draw (game, dt, ctx)  {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Game Over!", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
    ctx.fillText("You scored " + game.score + " and got to level " + game.level, game.width / 2, game.height/2);
    ctx.font="16px Arial";
    ctx.fillText("Press 'Space' to play again.", game.width / 2, game.height/2 + 40);
  }

  keyDown (game, keyCode) {
    if(keyCode == 32) /*space*/ {
      //  Space restarts the game.
      game.lives = 3;
      game.score = 0;
      game.level = 1;
      game.moveToState(new LevelIntroState(1));
    }
  }

}


//  Create a PlayState with the game config and the level you are on.
class PlayState {
  constructor(config, level){

    this.config = config;
    this.level = level;

    //  Game state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastRocketTime = null;

    //  Game entities.
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
  }

  enter (game) {

    //  Create the ship.
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom);

    //  Set the ship speed for this level, as well as invader params.
    let levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.bombMinVelocity = this.config.bombMinVelocity + (levelMultiplier * this.config.bombMinVelocity);
    this.bombMaxVelocity = this.config.bombMaxVelocity + (levelMultiplier * this.config.bombMaxVelocity);

    //  Create the invaders.
    let ranks = this.config.invaderRanks;
    let files = this.config.invaderFiles;
    let invaders = [];
    for(let rank = 0; rank < ranks; rank++){
      for(let file = 0; file < files; file++) {
        invaders.push(new Invader(
          (game.width / 2) + ((files/2 - file) * 400 / files),
          (game.gameBounds.top + rank * 40),
          rank, file, 'Invader'));
        }
      }
      this.invaders = invaders;
      this.invaderCurrentVelocity = this.invaderInitialVelocity;
      this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
      this.invaderNextVelocity = null;
    }

    update (game, dt) {

      //  If the left or right arrow keys are pressed, move
      //  the ship. Check this on ticks rather than via a keydown
      //  event for smooth movement, otherwise the ship would move
      //  more like a text editor caret.
      if(game.pressedKeys[37]) {
        this.ship.x -= this.shipSpeed * dt;
      }
      if(game.pressedKeys[39]) {
        this.ship.x += this.shipSpeed * dt;
      }
      if(game.pressedKeys[32]) {
        this.fireRocket();
      }

      //  Keep the ship in bounds.
      if(this.ship.x < game.gameBounds.left) {
        this.ship.x = game.gameBounds.left;
      }
      if(this.ship.x > game.gameBounds.right) {
        this.ship.x = game.gameBounds.right;
      }

      //  Move each bomb.
      for(let i=0; i<this.bombs.length; i++) {
        let bomb = this.bombs[i];
        bomb.y += dt * bomb.velocity;

        //  If the bomb has gone off the screen remove it.
        if(bomb.y > this.height) {
          this.bombs.splice(i--, 1);
        }
      }

      //  Move each rocket.
      for(i=0; i<this.rockets.length; i++) {
        let rocket = this.rockets[i];
        rocket.y -= dt * rocket.velocity;

        //  If the rocket has gone off the screen remove it.
        if(rocket.y < 0) {
          this.rockets.splice(i--, 1);
        }
      }

      //  Move the invaders.
      var hitLeft = false, hitRight = false, hitBottom = false;
      for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var newx = invader.x + this.invaderVelocity.x * dt;
        var newy = invader.y + this.invaderVelocity.y * dt;
        if(hitLeft === false && newx < game.gameBounds.left) {
          hitLeft = true;
        }
        else if(hitRight === false && newx > game.gameBounds.right) {
          hitRight = true;
        }
        else if(hitBottom === false && newy > game.gameBounds.bottom) {
          hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
          invader.x = newx;
          invader.y = newy;
        }
      }

      //  Update invader velocities.
      if(this.invadersAreDropping) {
        this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
        if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
          this.invadersAreDropping = false;
          this.invaderVelocity = this.invaderNextVelocity;
          this.invaderCurrentDropDistance = 0;
        }
      }
      //  If we've hit the left, move down then right.
      if(hitLeft) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {x: this.invaderCurrentVelocity , y:0};
      }
      //  If we've hit the right, move down then left.
      if(hitRight) {
        this.invaderCurrentVelocity += this.config.invaderAcceleration;
        this.invaderVelocity = {x: 0, y:this.invaderCurrentVelocity };
        this.invadersAreDropping = true;
        this.invaderNextVelocity = {x: -this.invaderCurrentVelocity , y:0};
      }
      //  If we've hit the bottom, it's game over.
      if(hitBottom) {
        this.lives = 0;
      }
      //  Check for rocket/invader collisions.
      for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var bang = false;

        for(var j=0; j<this.rockets.length; j++){
          var rocket = this.rockets[j];

          if(rocket.x >= (invader.x - invader.width/2) && rocket.x <= (invader.x + invader.width/2) &&
          rocket.y >= (invader.y - invader.height/2) && rocket.y <= (invader.y + invader.height/2)) {

            //  Remove the rocket, set 'bang' so we don't process
            //  this rocket again.
            this.rockets.splice(j--, 1);
            bang = true;
            game.score += this.config.pointsPerInvader;
            break;
          }
        }
        if(bang) {
          this.invaders.splice(i--, 1);
        }
      }
      //  Find all of the front rank invaders.
      var frontRankInvaders = {};
      for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
          frontRankInvaders[invader.file] = invader;
        }
      }

      //  Give each front rank invader a chance to drop a bomb.
      for(var i=0; i<this.config.invaderFiles; i++) {
        var invader = frontRankInvaders[i];
        if(!invader) continue;
        var chance = this.bombRate * dt;
        if(chance > Math.random()) {
          //  Fire!
          this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2,
            this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
          }
        }

        //  Check for bomb/ship collisions.
        for(var i=0; i<this.bombs.length; i++) {
          var bomb = this.bombs[i];
          if(bomb.x >= (this.ship.x - this.ship.width/2) && bomb.x <= (this.ship.x + this.ship.width/2) &&
          bomb.y >= (this.ship.y - this.ship.height/2) && bomb.y <= (this.ship.y + this.ship.height/2)) {
            this.bombs.splice(i--, 1);
            game.lives--;
          }

        }

        //  Check for invader/ship collisions.
        for(var i=0; i<this.invaders.length; i++) {
          var invader = this.invaders[i];
          if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) &&
          (invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
          (invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
          (invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) {
            //  Dead by collision!
            game.lives = 0;
            game.sounds.playSound('explosion');
          }
        }

        //  Check for failure
        if(game.lives <= 0) {
          game.moveToState(new GameOverState());
        }

        //  Check for victory
        if(this.invaders.length === 0) {
          game.score += this.level * 50;
          game.level += 1;
          game.moveToState(new LevelIntroState(game.level));
        }
      }

      fireRocket () {
        //  If we have no last rocket time, or the last rocket time
        //  is older than the max rocket rate, we can fire.
        if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate))
        {
          //  Add a rocket.
          this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
          this.lastRocketTime = (new Date()).valueOf();
        }
      };


      draw (game, dt, ctx) {

        //  Clear the background.
        ctx.clearRect(0, 0, game.width, game.height);
        ctx.drawImage(backgroundImage, 0, 40);
        //  Draw ship.
        //ctx.fillStyle = '#999999';
        //ctx.fillRect(this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);
        ctx.drawImage(goghImage, this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2));

        //  Draw invaders.
        ctx.fillStyle = '#006600';
        for(var i=0; i<this.invaders.length; i++) {
          var invader = this.invaders[i];
          //ctx.fillRect(invader.x - invader.width/2, invader.y - invader.height/2, invader.width, invader.height);
          ctx.drawImage(sunflowerImage, invader.x - invader.width/2, invader.y - invader.height/2);
        }

        //  Draw bombs.
        ctx.fillStyle = '#ff5555';
        for(let i = 0; i < this.bombs.length; i++) {
          let bomb = this.bombs[i];
          ctx.fillRect(bomb.x - 2, bomb.y - 2, 6, 6);
        }

        //  Draw rockets.
        ctx.fillStyle = '#ffffff';
        for(let i = 0; i < this.rockets.length; i++) {
          let rocket = this.rockets[i];
          // ctx.fillRect(rocket.x, rocket.y - 2, 1, 4);
          ctx.drawImage(paintImage, rocket.x, rocket.y);
        }

        //  Draw info.
        let textYpos = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
        ctx.font="20px 'Permanent Marker', cursive"
        ctx.fillStyle = '#ffffff';
        let info = "Lives: " + game.lives;
        ctx.textAlign = "left";
        ctx.fillText(info, game.gameBounds.left, textYpos);
        info = "Score: " + game.score + ", Level: " + game.level;
        ctx.textAlign = "right";
        ctx.fillText(info, game.gameBounds.right, textYpos);

      };

}
