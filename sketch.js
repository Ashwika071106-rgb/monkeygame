//creating variables
var monkey, monkey_running, ground;
var banana, bananaImage, obstacle, obstacleImage;
var foodGroup, obstacleGroup;
var score;
var gameState = "play";
var coin = 0;

function preload() {

  //adding animation 
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  //adding images
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");

}

function setup() {

  //creating canvas
  createCanvas(600, 200);

  //craeting monkey sprite and adding animation
  monkey = createSprite(50, 140, 20, 50);
  monkey.addAnimation("running", monkey_running);

  //scaling the monkey
  monkey.scale = 0.1;

  //creating ground sprite
  ground = createSprite(0, 180, 590, 15);
  //setting xPosition of ground
  ground.x = ground.width / 2;
  //scaling the ground
  ground.scale = 2;
  ground.shapeColor=rgb(34,139,34);

  //creating groups
  obstacleGroup = createGroup();
  foodGroup = createGroup();

  //setting collider
  monkey.setCollider("rectangle", 0, 0, monkey.width, monkey.height);
  monkey.debug = false;

  //setting initial value of survival rate
  score = 0;
}

function draw() {

  //setting the background
  background(rgb(135,206,235));

  if (gameState === "play") {
  
    //setting color for text
    fill(rgb(25,116,210));
    //displaying text
    text("Survival Rate: " + score, 450, 50);
    text("Coins:" + coin, 50, 50);

    //setting velocity of ground
    ground.velocityX = -(4 + 3 * score / 100);

    //scoring
    score = score + Math.round(getFrameRate() / 60);

    //resetting ground
    if (ground.x < 10) {
      ground.x = ground.width / 2;
    }

    //making monkey collide with ground
    monkey.collide(ground);

    //making monkey jump on pressing space key
    if (keyDown("space") && monkey.y >= 100) {
      monkey.velocityY = -12;
    }

    //adding gravity
    monkey.velocityY = monkey.velocityY + 0.8;

    //destroying food if monkey touches it and increasing coins
    if (foodGroup.isTouching(monkey)) {
      coin += 100;
      foodGroup.destroyEach();
    }

    //changing gameState to end on collision with obstacles
    if (obstacleGroup.isTouching(monkey)) {
      gameState = "end";
    }

      //spawn bananas
      spawnFood();

      //spawn obstacles on the ground
      spawnObstacles();

  }

   //stopping movement if gamestate is end
    else if (gameState === "end") {

      ground.velocityX = 0;
      monkey.velocityY = 0;

      //set lifetime of the game objects so that they are never destroyed
      obstacleGroup.setLifetimeEach(-1);
      foodGroup.setLifetimeEach(-1);

      obstacleGroup.setVelocityXEach(0);
      foodGroup.setVelocityXEach(0);

      //display text
      fill(rgb(25,116,210));
      text("Survival Rate: " + score, 260, 90);
      text("Coins:" + coin, 260, 110);
      textSize(30);
      text("GAME OVER", 210, 50);
    }

   //drawing sprites
   drawSprites();
}

//spawning obstacles 
function spawnObstacles() {
  if (frameCount % 300 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -(6 + score / 100);


    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}

//spawning food
function spawnFood() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    banana = createSprite(600, 120, 40, 10);
    banana.y = Math.round(random(50, 150));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -(4+score/100);

    //assign lifetime to the variable
    banana.lifetime = 200;

    //adjust the depth
    banana.depth = banana.depth;
    monkey.depth = monkey.depth + 1;

    //add each cloud to the group
    foodGroup.add(banana);
  }
}