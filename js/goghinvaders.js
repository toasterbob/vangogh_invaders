

// The main game loop.
const gameLoop = (game) => {
    let currentState = game.currentState();
    if(currentState) {

        //  Delta t is the time to update/draw.
        let dt = 1 / game.config.fps;

        //  the drawing context.
        let ctx = game.gameCanvas.getContext("2d");

        //  draw or update if they have that function in the class
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }

};


class VanGogh  {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 62;
    this.height = 70;
    this.goghImage = new Image();
    this.goghReady = false;
    this.goghImage.onload = () => {
    	this.goghReady = true;
    };
    this.goghImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_62/v1485138973/van_gogh_bust_gpdqxv.png";
  }

}


class Paintbrush {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;

    this.paintReady = false;
    this.paintImage = new Image();
    this.paintImage.onload = () => {
    	this.paintReady = true;
    };
    this.paintImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/a_314/c_crop,h_400,w_55/c_scale,w_10/c_scale,w_10/v1485420453/brush_zc5s2v.png";

  }
}


class Bomb {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;

    this.paintReady = false;
    this.paintImage = new Image();
    this.paintImage.onload = () => {
      this.paintReady = true;
    };
    this.paintImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_10/v1485419875/paint_xc8mpl.png";

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

    this.sunflowerReady = false;
    this.sunflowerImage = new Image();
    this.sunflowerImage.onload = () => {
    	this.sunflowerReady = true;
    };
    this.sunflowerImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_40/v1485418344/sunflower_nyzhub.png";

    this.sunflower2Ready = false;
    this.sunflower2Image = new Image();
    this.sunflower2Image.onload = () => {
    	this.sunflower2Ready = true;
    };
    this.sunflower2Image.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_40/a_180/v1485418344/sunflower_nyzhub.png";
  }
}

class Sounds {
  constructor(){
    this.explosionSound = new Audio('lib/pop_x.wav');
    this.alarmSound = new Audio('lib/klaxon_ahooga.wav');
    this.screamSound = new Audio('lib/scream.wav');
    this.victorySound = new Audio('lib/laugh_x.wav');
    this.invadersWinSound = new Audio('lib/ominous.wav');
  }
}

class Background {
  constructor(){
    this.backgroundReady = false;
    this.backgroundImage = new Image();
    this.backgroundImage.onload = () => {
    	this.backgroundReady = true;
    };
    this.backgroundImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_800/v1485139498/Starry_Night2_znb8ym.jpg";
  }
}

//sounds - seem to work better when called here rather than in a class
let explosionSound = new Audio('lib/pop_x.wav');
let alarmSound = new Audio('lib/klaxon_ahooga.wav');
let screamSound = new Audio('lib/scream.wav');
let victorySound = new Audio('lib/laugh_x.wav');
let invadersWinSound = new Audio('lib/ominous.wav');



class Game {

  constructor() {

    this.config = {
      bombRate: 0.08,
      bombMinVelocity: 50,
      bombMaxVelocity: 100,
      invaderInitialVelocity: 25,
      invaderAcceleration: 10,
      invaderDropDistance: 30,
      paintbrushVelocity: 230,
      paintbrushMaxFireRate: 1.5,
      gameWidth: 700,
      gameHeight: 530,
      fps: 50,
      invaderRanks: 4,
      invaderFiles: 8,
      vincentSpeed: 120,
      levelDifficultyMultiplier: 0.4,
      pointsPerInvader: 20
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
  //  Initialize the Game with a canvas.
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

      //  Game begins with the Welcome State
      this.moveToState(new WelcomeState());

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
      if (this.level > 5) {
        ctx.fillText("Masterpiece of Defense! ", game.width / 2, game.height/2 + 36);
        ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 76);
      } else if (this.level > 3) {
        ctx.fillText("You're pretty good! ", game.width / 2, game.height/2 + 36);
        ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 76);
      } else if (this.level > 1) {
        ctx.fillText("Not too shabby! ", game.width / 2, game.height/2 + 36);
        ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 76);
      } else {

        ctx.fillText("Ready in " + this.countdownMessage, game.width / 2, game.height/2 + 36);
      }
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
        alarmSound.play();
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

    ctx.font="40px 'Permanent Marker', cursive";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Game OVER Van Gogh", game.width / 2, game.height/2 - 80);
    ctx.font="30px 'Permanent Marker', cursive";
    ctx.fillText("Maybe you should stick to painting", game.width / 2, game.height/2 - 40);
    ctx.font="18px 'Permanent Marker', cursive";
    ctx.fillText("You earned " + game.score + " points and made it to level " + game.level, game.width / 2, game.height/2);
    ctx.font="16px 'Permanent Marker', cursive";
    ctx.fillText("Press 'Space' to try again.", game.width / 2, game.height/2 + 40);
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

/////////////////////MAIN GAME CLASS////////////////////////////////////////////////////////////////////////////////
//  Create a PlayState with the game config and the level you are on.
class PlayState {
  constructor(config, level){

    this.config = config;
    this.level = level;

    //  Game state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastPaintbrushTime = null;

    //  Game entities.
    this.vincent = null;
    this.invaders = [];
    this.paintbrushes = [];
    this.bombs = [];
    this.prev = 0;
    this.switch = true;
  }

  enter (game) {

    //  Create the vincent.
    this.vincent = new VanGogh(game.width / 2, game.gameBounds.bottom);

    //  Set the vincent speed for this level, as well as invader params.
    let levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    this.vincentSpeed = this.config.vincentSpeed;
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
          (game.gameBounds.top + 40 + rank * 40),
          rank, file, 'Invader'));
        }
      }
      this.invaders = invaders;
      this.invaderCurrentVelocity = this.invaderInitialVelocity;
      this.invaderVelocity = {x: -this.invaderInitialVelocity, y:0};
      this.invaderNextVelocity = null;
    }

    update (game, dt) {
      //toggle every second -used for invader image
      let now = Date.now();
      if ((now - this.prev) > 1000) {

        this.switch = this.switch ? false : true;

        this.prev = now;
      }

      // this.sound = new Sounds();

      //  If the left or right arrow keys are pressed, move
      //  the vincent. Check this on ticks rather than via a keydown
      //  event for smooth movement, otherwise the vincent would move
      //  more like a text editor caret.
      if(game.pressedKeys[37]) {
        this.vincent.x -= this.vincentSpeed * dt;
      }
      if(game.pressedKeys[39]) {
        this.vincent.x += this.vincentSpeed * dt;
      }
      if(game.pressedKeys[32]) {
        this.firePaintbrush();
      }

      //  Keep the vincent in bounds.
      if(this.vincent.x < game.gameBounds.left) {
        this.vincent.x = game.gameBounds.left;
      }
      if(this.vincent.x > game.gameBounds.right) {
        this.vincent.x = game.gameBounds.right;
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

      //  Move each paintbrush.
      for(let i=0; i<this.paintbrushes.length; i++) {
        let paintbrush = this.paintbrushes[i];
        paintbrush.y -= dt * paintbrush.velocity;

        //  If the paintbrush has gone off the screen remove it.
        if(paintbrush.y < 0) {
          this.paintbrushes.splice(i--, 1);
        }
      }

      //  Move the invaders.
      let hitLeft = false, hitRight = false, hitBottom = false;
      for(let i=0; i<this.invaders.length; i++) {
        let invader = this.invaders[i];
        let newx = invader.x + this.invaderVelocity.x * dt;
        let newy = invader.y + this.invaderVelocity.y * dt;
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
      //  Check for paintbrush/invader collisions.
      // let sound = this.sound;
      for(let i=0; i<this.invaders.length; i++) {
        let invader = this.invaders[i];
        let destroyed = false;

        for(let j=0; j<this.paintbrushes.length; j++){
          let paintbrush = this.paintbrushes[j];

          if(paintbrush.x >= (invader.x - invader.width/2) && paintbrush.x <= (invader.x + invader.width/2) &&
          paintbrush.y >= (invader.y - invader.height/2) && paintbrush.y + 20 <= (invader.y + invader.height/2)) {

            //  Remove the paintbrush, set 'destroyed' so we don't process
            //  this paintbrush again.
            this.paintbrushes.splice(j--, 1);
            destroyed = true;
            game.score += this.config.pointsPerInvader;
            explosionSound.play();
            break;
          }
        }
        if(destroyed) {
          this.invaders.splice(i--, 1);
        }
      }
      //  Find all of the front rank invaders.
      let frontRankInvaders = {};
      for(let i=0; i<this.invaders.length; i++) {
        let invader = this.invaders[i];
        //  If we have no invader for game file, or the invader
        //  for game file is futher behind, set the front
        //  rank invader to game one.
        if(!frontRankInvaders[invader.file] || frontRankInvaders[invader.file].rank < invader.rank) {
          frontRankInvaders[invader.file] = invader;
        }
      }

      //  Give each front rank invader a chance to drop a bomb.
      for(let i=0; i<this.config.invaderFiles; i++) {
        let invader = frontRankInvaders[i];
        if(!invader) continue;
        let chance = this.bombRate * dt;
        if(chance > Math.random()) {
          //  Fire!
          this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2,
            this.bombMinVelocity + Math.random()*(this.bombMaxVelocity - this.bombMinVelocity)));
          }
        }

        //  Check for bomb/vincent collisions.
        for(let i=0; i<this.bombs.length; i++) {
          let bomb = this.bombs[i];
          if(bomb.x >= (this.vincent.x - this.vincent.width/2) && bomb.x <= (this.vincent.x + this.vincent.width/2) &&
          bomb.y >= (this.vincent.y - this.vincent.height/2) && bomb.y <= (this.vincent.y + this.vincent.height/2)) {
            this.bombs.splice(i--, 1);
            game.lives--;
            screamSound.play();
          }

        }

        //  Check for invader/vincent collisions.

        for(let i = 0; i < this.invaders.length; i++) {
          let invader = this.invaders[i];
          if((invader.x + invader.width/2) > (this.vincent.x - this.vincent.width/2) &&
          (invader.x - invader.width/2) < (this.vincent.x + this.vincent.width/2) &&
          (invader.y + invader.height/2) > (this.vincent.y - this.vincent.height/2) &&
          (invader.y - invader.height/2) < (this.vincent.y + this.vincent.height/2)) {
            invadersWinSound.play();
            game.lives = 0;

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
          victorySound.play();
          game.moveToState(new LevelIntroState(game.level));
        }
      }

      firePaintbrush () {
        //  If we have no last paintbrush time, or the last paintbrush time
        //  is older than the max paintbrush rate, we can fire.
        if(this.lastPaintbrushTime === null || ((new Date()).valueOf() - this.lastPaintbrushTime) > (1000 / this.config.paintbrushMaxFireRate))
        {
          //  Add a paintbrush.
          this.paintbrushes.push(new Paintbrush(this.vincent.x, this.vincent.y - 12, this.config.paintbrushVelocity));
          this.lastPaintbrushTime = (new Date()).valueOf();
        }
      }


      draw (game, dt, ctx) {

        //  Clear the background.
        ctx.clearRect(0, 0, game.width, game.height);
        this.background = new Background();
        ctx.drawImage(this.background.backgroundImage, 0, 40);
        //  Draw vincent.
        //ctx.fillStyle = '#999999';
        //ctx.fillRect(this.vincent.x - (this.vincent.width / 2), this.vincent.y - (this.vincent.height / 2), this.vincent.width, this.vincent.height);
        ctx.drawImage(this.vincent.goghImage, this.vincent.x - (this.vincent.width / 2), this.vincent.y - (this.vincent.height / 2));

        //  Draw invaders.
        ctx.fillStyle = '#006600';
        let invader;
        for(let i = 0; i < this.invaders.length; i++) {
          invader = this.invaders[i];
          if (this.switch) {
            ctx.drawImage(invader.sunflowerImage, invader.x - invader.width/2, invader.y - invader.height/2);
          } else {
            ctx.drawImage(invader.sunflower2Image, invader.x - invader.width/2, invader.y - invader.height/2);
          }
        }

        //  Draw bombs.
        ctx.fillStyle = '#ff5555';
        for(let i = 0; i < this.bombs.length; i++) {
          let bomb = this.bombs[i];
          ctx.fillRect(bomb.x - 4, bomb.y - 4, 8, 8);
          //ctx.drawImage(bomb.paintImage, bomb.x - 5, bomb.y - 5);
        }

        //  Draw paintbrushes.
        ctx.fillStyle = '#ffffff';
        for(let i = 0; i < this.paintbrushes.length; i++) {
          let paintbrush = this.paintbrushes[i];
          // ctx.fillRect(paintbrush.x, paintbrush.y - 2, 1, 4);
          ctx.drawImage(paintbrush.paintImage, paintbrush.x, paintbrush.y);
        }

        //  Bottom of the screen game information.
        let text_position = game.gameBounds.bottom + ((game.height - game.gameBounds.bottom) / 2) + 14/2;
        ctx.font="20px 'Permanent Marker', cursive";
        ctx.fillStyle = '#ffffff';
        let info = "Lives: " + game.lives;
        ctx.textAlign = "left";
        ctx.fillText(info, game.gameBounds.left, text_position);
        info = "Score: " + game.score + ", Level: " + game.level;
        ctx.textAlign = "right";
        ctx.fillText(info, game.gameBounds.right, text_position);

      }

}
