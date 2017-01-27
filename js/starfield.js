

class Starfield {
	constructor() {
		this.fps = 30;
		this.canvas = null;
		this.width = 0;
		this.height = 0;
		this.minVelocity = 15;
		this.maxVelocity = 30;
		this.stars = 100;
		this.intervalId = 0;
	}
	//need to pass in a div on initialize
	initialize (div) {
		let self = this;

		//	Store the div.
		this.containerDiv = div;
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		window.addEventListener('resize', function resize(event) {
			self.width = window.innerWidth;
			self.height = window.innerHeight;
			self.canvas.width = self.width;
			self.canvas.height = self.height;
			self.draw();
		});

		//	Create the canvas.
		let canvas = document.createElement('canvas');
		div.appendChild(canvas);
		this.canvas = canvas;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	start () {

		//	Create the stars.
		let stars = [];
		for(let i = 0; i < this.stars; i++) {
			stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1,
			(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
		this.stars = stars;

		let self = this;
		//	Start the timer.
		this.intervalId = setInterval(() => {
			self.update();
			self.draw();
		}, 1000 / this.fps);
	}

	stop () {
		clearInterval(this.intervalId);
	}

	unstop () {
		let self = this;
		//	Start the timer.
		this.intervalId = setInterval(() => {
			self.update();
			self.draw();
		}, 1000 / this.fps);
	}

	update () {
		let dt = 1 / this.fps;

		for(let i = 0; i < this.stars.length; i++) {
			let star = this.stars[i];
			star.y += dt * star.velocity;
			//	If the star has moved from the bottom of the screen, spawn it at the top.
			if(star.y > this.height) {
				this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1,
				(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
			}
		}
	}

	draw () {

		//	Get the drawing context.
		var ctx = this.canvas.getContext("2d");

		//	Draw the background.
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, this.width, this.height);

		//	Differnt colors for twinkling stars
		var colors = ['#ffffff', "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad",
		"#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

		for(var i=0; i<this.stars.length;i++) {
			ctx.fillStyle = colors[Math.random() * colors.length | 0]; //color changes constantly 
			var star = this.stars[i];
			ctx.fillRect(star.x, star.y, star.size, star.size);
		}
	}

}


class Star {
	constructor(x, y, size, velocity){
		this.x = x;
		this.y = y;
		this.size = size;
		this.velocity = velocity;
	}
}
