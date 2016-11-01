/*
 * @name Load and Play Sound
 * @description Load sound during preload(). Play a sound when canvas is clicked.
 * <br><br><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * a sound file, and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em>
 */
var song;
var canvas;

function setup() {
	song = loadSound('../assets/not-an-addict.mp3');
	canvas = createCanvas(1000, 400);
	canvas.parent('canvasp');
	canvas.style("visibility", "visible");
	noFill();
	background(255, 0, 0);
	fft = new p5.FFT();
	fft.setInput(song);
}

function mousePressed() {
	if (song.isPlaying()) { // .isPlaying() returns a boolean
		song.stop();
		//background(255,0,0);
	} else {
		song.play();
		//background(0,255,0);
	}
}

function draw() {
	background(255);

	var spectrum = fft.analyze();

	beginShape();
	for (i = 0; i < spectrum.length; i++) {
		vertex(i, map(spectrum[i], 0, 255, height, 0));
	}
	endShape();
}

