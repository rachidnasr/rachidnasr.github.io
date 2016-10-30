var underlyingImage;

function preload() {
    var myImageURL = "img/rachid.jpg";
    underlyingImage = loadImage(myImageURL);
}

function setup() {
    createCanvas(500, 608).parent("myCanvas");
    background(255);
    underlyingImage.loadPixels();
    
}

function draw() {
    var px = random(width);
    var py = random(height);
    var ix = constrain(floor(px), 0, width-1);
    var iy = constrain(floor(py), 0, height-1);
    var theColorAtLocationXY = underlyingImage.get(ix, iy);

    noStroke();
    fill(theColorAtLocationXY);
    ellipse(px, py, 10, 10);
    
    var theColorAtTheMouse = underlyingImage.get(mouseX, mouseY);
    stroke(theColorAtTheMouse);
    line(pmouseX, pmouseY, mouseX, mouseY);
}