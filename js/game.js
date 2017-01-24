// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 792;
document.body.appendChild(canvas);

// Background image
let backgroundReady = false;
let backgroundImage = new Image();
backgroundImage.onload = () => {
	backgroundReady = true;
};
backgroundImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_1000/v1485139498/Starry_Night2_znb8ym.jpg";
// backgroundImage.height = "1024";
// backgroundImage.width = "790";
// backgroundImage.style.backgroundSize = "100%";


// VanGogh image
let goghReady = false;
let goghImage = new Image();
goghImage.onload = () => {
	goghReady = true;
};
goghImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_89/v1485138973/van_gogh_bust_gpdqxv.png";

// Ear image
let earReady = false;
let earImage = new Image();
earImage.onload = () => {
	earReady = true;
};
earImage.src = "http://res.cloudinary.com/dseky3p5e/image/upload/c_scale,w_53/v1485138892/ear_rwuxsy.png";
earImage.height = "50%";
earImage.width = "50%";



// Game objects
let gogh = {
	speed: 512 // movement in pixels per second
};
let ear = {};
let earsCaught = 0;

// Handle keyboard controls
let keysDown = {};

addEventListener("keydown", (e) => {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", (e) => {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a ear
let reset = () => {
	gogh.x = canvas.width / 2;
	gogh.y = canvas.height - 100;

	// Throw the ear somewhere on the screen randomly
	ear.x = 32 + (Math.random() * (canvas.width - 64));
	ear.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
let update = (modifier) => {
	if (38 in keysDown) { // Player holding up
		gogh.y -= gogh.speed * modifier;
    if (gogh.y < 40 - 5) {
      gogh.y = 40 - 5;
    }
	}
	if (40 in keysDown) { // Player holding down
		gogh.y += gogh.speed * modifier;
    if (gogh.y > canvas.height - 70) {
      gogh.y = canvas.height - 70;
    }
	}
	if (37 in keysDown) { // Player holding left
		gogh.x -= gogh.speed * modifier;
    if (gogh.x < 0 -25) {
      gogh.x = 0 - 25;
    }
	}
	if (39 in keysDown) { // Player holding right
		gogh.x += gogh.speed * modifier;
    if (gogh.x > canvas.width - 60) {
      gogh.x = canvas.width - 60;
    }
	}

  if (87 in keysDown) { // Player holding w - moves up
		gogh.y -= gogh.speed * modifier;
	}
	if (83 in keysDown) { // Player holding s - moves down
		gogh.y += gogh.speed * modifier;
	}
	if (65 in keysDown) { // Player holding a - moves left
		gogh.x -= gogh.speed * modifier;
	}
	if (68 in keysDown) { // Player holding d - moves right
		gogh.x += gogh.speed * modifier;
	}

	// Are they touching?
	if (
		gogh.x <= (ear.x + 20)
		&& ear.x <= (gogh.x + 55)
		&& gogh.y <= (ear.y + 45)
		&& ear.y <= (gogh.y + 65)
	) {
		++earsCaught;
		reset();
	}
};

// Draw everything
let render = () => {
	if (backgroundReady) {
		ctx.drawImage(backgroundImage, 0, 40);
	}

	if (goghReady) {
		ctx.drawImage(goghImage, gogh.x, gogh.y);
	}

	if (earReady) {
		ctx.drawImage(earImage, ear.x, ear.y);
	}

	// Score
	// ctx.fillStyle = "rgb(0, 240, 240)";
	// ctx.font = "24px Arial";
	// ctx.textAlign = "left";
	// ctx.textBaseline = "top";
	// ctx.fillText("Ears found: " + earsCaught, 32, 32);
};

// The main game loop
let main = () => {
	let now = Date.now();
	let delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
reset();
main();
