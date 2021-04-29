var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  kangaroo_running =   loadAnimation("Kangaroo Jump-01.png","Kangaroo Jump-02.png","Kangaroo Jump-03.png","Kangaroo Jump-04.png",
  "Kangaroo Jump-05.png","Kangaroo Jump-06.png","Kangaroo Jump-07.png","Kangaroo Jump-08.png");
  kangaroo_collided = loadAnimation("Kangaroo Jump-01.png");
  
  groundImage = loadImage("Bg.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Grass And Tree-01.png");
  obstacle2 = loadImage("Grass And Tree-02.png");
  obstacle3 = loadImage("Grass And Tree-03.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  ground = createSprite(200,180,400,20);
  ground.scale = 0.5;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = (6 + 3*score/100);
 

  kangaroo = createSprite(550,180,20,50);
  
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.05;
  
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //kangaroo.debug = true;
  background(255);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = (6 + 3*score/100);
    camera.position.y = kangaroo.y;
    //change the kangaroo animation
    kangaroo.changeAnimation("running", kangaroo_running);

    if(keyDown("space")) {
      kangaroo.velocityY = -12;
      
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
  
    if (ground.x > 600){
      ground.x = 300;
    }
  
    kangaroo.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(kangaroo)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the kangaroo animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

    else if (gameState === WIN) {
     
      //set velcity of each game object to 0
      ground.velocityX = 0;
      kangaroo.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      
      //change the kangaroo animation
      kangaroo.changeAnimation("collided",kangaroo_collided);
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
     
  }
  
  
  drawSprites();
  textSize(20);
  text("Score: "+ score, 500,100);

  if(score > 500){
    textSize(30);
    fill("red")
    text("Congragulations!! You win the game!! ", 50,100);
    gameState = WIN;
   
  }
}



function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(0,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = 3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = kangaroo.depth;
    kangaroo.depth = kangaroo.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(0,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
     
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

