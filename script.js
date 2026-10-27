//voor piramide
var aantallagen = 10;
var breedte;
var hoogte;

var aantalLevens = 3;
var raster;
var eve;
var alice;
var bob;
var cindy;
var pingpongbal;

class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }
  

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    //maak de vakjes
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        //blauwe randen
        if (rij == 0 || rij == this.aantalRijen - 1 ||
          kolom == 0 || kolom == this.aantalKolommen - 1) {
          stroke('blue');
        } else {
          stroke('grey');
        }
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }

    pop();
  }
}
  
class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
    //links
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    //rechts
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }

    //omhoog
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    //omlaag
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width -Raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - Raster.celGrootte);

    if (this.x >= canvas.width - Raster.celGrootte) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    var d = dist(
      this.x + Raster.celGrootte / 2,
      this.y + raster.celGrootte / 2,
      vijand.x + raster.celGrootte /2,
      vijand.y);
    if (d < raster.celGrootte / 2) {
      return true;
    }
    return false;
    }
  

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }


class Vijand {//Wat moet ik hier doen om te fixen??
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  
//voor piramide
  breedte = 900 / aantallagen
  hoogte = breedte / 2

  raster = new Raster(12,18);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(650,300)
  cindy.stapGrootte = 1*eve.stapGrootte
  cindy.sprite = loadImage("images/sprites/Bob100px/Bob.png")
  pingpongbal = new Pingpongbal();
}

function draw() {
  background(brug);

  push();
  fill('lightgray')
  stroke('darkgrey')
  translate(0, 0);
  tekenPiramide(aantallagen);
  pop();
  
  raster.teken();
  
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.beweeg();
  cindy.toon();

  pingpongbal.checkPakOp(eve);
  pingpongbal.toon();

  push();
  textSize(24);
  fill('white');
  stroke('black');
  strokeWeight(4);
  text("Levens: " + aantalLevens , 20, 30);
  pop();
    

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy)) {
    aantalLevens--;

  eve.x = 250;
  eve.y = 250;

  if (aantalLevens <= 0) {
    background('red');
    fill('white');
    textSize(60);
    text("Game Over!", 250, 300);
    noLoop();
  }
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!",30,300);
    noLoop();
  }
}
function tekenPiramide(n) {
  if (n>0) {
    for (var nr=0;nr<n; nr++){
      rect(nr*breedte, 0,breedte ,hoogte);
    }
    translate(breedte / 2, hoogte);
    n--;
    tekenPiramide(n);
  }

class pingpongbal {
  constructor() {
    this.x = floor(random(2,15))*50; //random vakje kiezen
    this.y = floor(random(2,16))*50;
    this.actief = true; 
  }
toon(){
  if (this.actief) {
    push();
    fill('orange'); 
    stroke('black');
    strokeWeight(2);
    SVGEllipseElement(this.x + raster.celGrootte/2, this.y + raster.celGrootte/2, raster.celGrootte * 0.6);
    pop();
  }
}
checkPakOp(speler) {
  if (this.actief) {
    var d = dist(speler.x, speler.y, this.x, this.y);
    if (d < raster.celGrootte / 2){
      aantalLevens++;
      this.actief = false;
    }
  }
}

}
  

}
