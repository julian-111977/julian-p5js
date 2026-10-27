//voor piramide
var aantallagen = 10;
var breedte;
var hoogte;
var canvas;

var aantalLevens = 3;
var raster;
var eve;
var alice;
var bob;
var cindy;
var pingpongbal;
var brug;

var raket1;
var raket2;
var raket3;

var spelAfgelopen = false;
var gewonnen = false;
var achtergrondKleur = null;
var knopX, knopY, knopBreedte, knopHoogte;

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
    //maakt de vakjes
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        //blauwe randen
        if (rij == 0 || rij == this.aantalRijen - 1 ||
          kolom == 0 || kolom == this.aantalKolommen - 1) {
          stroke('blue');
          strokeWeight(5);
        } else {
          stroke('grey');
          strokeWeight(1);
        }
        rect(kolom*this.celGrootte,
             rij*this.celGrootte,
             this.celGrootte,
             this.celGrootte);
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

    this.x = constrain(this.x,0,canvas.width -raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x >= canvas.width - raster.celGrootte) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    var d = dist(
      this.x + raster.celGrootte / 2,
      this.y + raster.celGrootte / 2,
      vijand.x + raster.celGrootte /2,
      vijand.y + raster.celGrootte /2
    );
    
    return d < raster.celGrootte;
    }
  

  toon() {
    if(this.animatie[this.frameNummer]){
      image(
        this.animatie[this.frameNummer],
        this.x,
        this.y,
        raster.celGrootte,
        raster.celGrootte
      );
    }
  }
  }


class Vijand {
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
    if (this.sprite) {
      image(
        this.sprite, this.x, this.y, raster.celGrootte,raster.celGrootte
      );
    }
  }
}

class Pingpongbal {
  constructor() {
    this.kolom = floor(random(2,raster.aantalKolommen - 2));
    this.rij = floor(random(2,raster.aantalRijen));

    this.x = this.kolom * raster.celGrootte;
    this.y = this.rij * raster.celGrootte;

    this.richtingX = random([-1,1]);
    this.richtingY = random([-1,1]);
    
    this.actief = true; 
    this.teller = 0;
    this.wachttijd = 3;
  }

  beweeg() {
    if(!this.actief) {
      return;
    }
    this.teller++;

    if (this.teller < this.wachttijd) {
      return;
    }

    this.teller = 0;

    this.kolom += this.richtingX;
    this.rij += this.richtingY;

    if (
      this.kolom <= 1 ||
      this.kolom >= raster.aantalKolommen - 2)
    {
      this.richtingX *= -1;
      this.kolom += this.richtingX * 2;
    }
    if(
      this.rij<= 1 ||
      this.rij >= raster.aantalRijen - 2
    ){
      this.richtingY *= -1;
      this.rij += this.richtingY * 2
    }
    this.kolom = constrain(
      this.kolom, 1, raster.aantalKolommen -2
    );

    this.rij = constrain(
      this.rij, 1, raster.aantalRijen -2
    );

    this.x = this.kolom * raster.celGrootte;
    this.y = this.rij * raster.celGrootte;
  }

  toon() {
    if (this.actief){
      push();

      fill("orange");
      stroke("black");
      strokeWeight(2);

      ellipse(
        this.x + Raster.celGrootte /2,
        this.y + Raster.celGrootte /2,
        Raster.celGrootte * 0.6
      );

      pop();
    }
  }

  checkPakOp(speler) {
    if (!this.actief) {
      return;
    }
      var d = dist(
        speler.x + Raster.celGrootte / 2,
        speler.y + Raster.celGrootte /2, 
        this.x + Raster.celGrootte,
        this.y + Raster.celGrootte
      );
      if (d < Raster.celGrootte){
        aantalLevens++;
        this.actief = false;
      }
    }
  }

class Raket {
  constructor() {
    var kolom = floor(random(10,17));

    this.x = kolom * raster.celGrootte;
    this.y = floor(random(1, raster.aantalRijen - 2)) * raster.celGrootte;

    this.snelheid = random(1, 3);
    this.valversnelling = 0.15;
    this.richting = random([-1, 1]);

    this.sprite = loadImage("images/sprites/raket.png");
  }  
  

  beweeg() {
    this.snelheid += this.valversnelling;

    this.y += this.richting * this.snelheid;

    if (this.y <= 0) {
      this.y = 0;
      this.richting = 1;
      this.snelheid = 0.5;
    }

    if(this.y >= canvas.height - raster.celGrootte) {
      this.y = canvas.height - raster.celGrootte;
      this.richting = -1;
      this.snelheid = 0.5;
    }
  }  

  toon() {
    if (this.sprite) {
      image(
        this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte
      );
    } else {
      push();

      fill("red");
      stroke("white");

      triangle(
        this.x + raster.celGrootte / 2, 
        this.y,
        this.x,
        this.y + raster.celGrootte,
        this.x + raster.celGrootte,
        this.y + raster.celGrootte
      );

      pop();
    }
  }

  wordtGeraakt(speler) {
    var d = dist(
      speler.x + raster.celGrootte /2,
      speler.y + raster.celGrootte /2,
      this.x + raster.celGrootte / 2,
      this.y + raster.celGrootte / 2
    );
  
    return d < raster.celGrootte;
  }
} 

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  
//voor piramide
  breedte = 900 / aantallagen
  hoogte = breedte / 2

  raster = new Raster(12,18);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = raster.celGrootte;
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

  raket1 = new Raket();
  raket2 = new Raket();
  raket3 = new Raket();
}

function draw() {
  if (muisOpBlauweRand()) {
    background("lightblue");
  }else {
    background(brug);
  }

  push();
  
  fill('lightgray')
  stroke('darkgrey')
  
  tekenPiramide(aantallagen);
  
  pop();
  
  raster.teken();
  
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();

  pingpongbal.beweeg();

  raket1.beweeg();
  raket2.beweeg();
  raket3.beweeg();
  
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();

  pingpongbal.checkPakOp(eve);
  pingpongbal.toon();

  raket1.toon();
  raket2.toon();
  raket3.toon();

  push();
  
  textSize(24);
  fill('white');
  stroke('black');
  strokeWeight(4);
  text("Levens: " + aantalLevens , 20, 30);
  
  pop();
    

  if (
    eve.wordtGeraakt(alice) || 
    eve.wordtGeraakt(bob) || 
    eve.wordtGeraakt(cindy) ||
    raket1.wordtGeraakt(eve) ||
    raket2.wordtGeraakt(eve) ||
    raket3.wordtGeraakt(eve)
  ) {
    aantalLevens--;

  eve.x = 250;
  eve.y = 250;
 }
  if (aantalLevens <= 0) {
    spelAfgelopen = true;
    gewonnen = false;
    toonEindscherm(gewonnen);
    noLoop();
    return;
   }

  if (eve.gehaald) {
    spelAfgelopen = true;
    gewonnen = true;
    toonEindscherm(gewonnen);
    noLoop();
    return;
  }
}


function tekenPiramide(n) {
  if (n>0) {
    for (var nr=0;nr<n; nr++){
      rect(nr*breedte, 
           0,
           breedte,
           hoogte
          );
    }
    translate(breedte / 2, hoogte);
  
    tekenPiramide(n - 1);
  }
}
    
function muisOpBlauweRand() {
  if (
    mouseX < 0 ||
    mouseX >= canvas.width ||
    mouseY < 0 ||
    mouseY >= canvas.height
  ){
    return false;
  }

  var kolom = floor(mouseX / raster.celGrootte);
  var rij = floor(mouseY / raster.celGrootte);

  return(
    rij == 0 ||
    rij == raster.aantalRijen - 1 ||
    kolom == 0 ||
    kolom == raster.aantalKolommen - 1
  );
}
    
function toonEindscherm(isGewonnen) {
  if (isGewonnen){
    background("green");
  }
  else {
    background("red");
  }
  push();

  fill("white");
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(40);

  if (isGewonnen) {
    text("Je hebt gewonnen!", canvas.width / 2, 220)
  }
  else {
    text("Game Over!", canvas.width / 2, 220)
  }

  //knop
  knopBreedte = 240;
  knopHoogte = 60;
  knopX = (canvas.width - knopBreedte) / 2;
  knopY = 320;

  //tekenen knop
  fill("white");
  stroke("black");
  strokeWeight(2);
  rect(knopX, knopY, knopBreedte, knopHoogte, 10);

  fill("black");
  noStroke();
  textSize(22);
  text(
    "Opnieuw spelen",
    knopX + knopBreedte / 2,
    knopY + knopHoogte / 2
  );

  pop();
}

function mousePressed() {
  if (!spelAfgelopen){
    return;
  }
  
  if (
    mouseX >= knopX &&
    mouseX <= knopX + knopBreedte &&
    mouseY >= knopY &&
    mouseY <= knopY + knopHoogte
  ) {
    resetSpel();
  }
}
function resetSpel(){
  aantalLevens = 3;
  spelAfgelopen = false;
  gewonnen = false;

  eve = new Jos();
  eve.stapGrootte = raster.celGrootte;
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

  raket1 = new Raket();
  raket2 = new Raket();
  raket3 = new Raket();

  loop();  
}
  
