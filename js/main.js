var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});
var centerx = game.width / 2;
var centery = game.height / 2;
var pad1;
var ro = .5;
var speed = 1;
var boost = 0;
var msgset = 0;
var bg = Math.floor((Math.random() * 9) + 1);
var a = 1; //which astro are we on
var numof = 2; //total number of astros
var changeA = 0; //0 when changing Astro is allowed
var mfal = 0;
var sscon = 0;
function preload() {
  speak("Exiting Space Station");
  //  You can fill the preloader with as many assets as your game requires

  //  Here we are loading an image. The first parameter is the unique
  //  string by which we'll identify the image later in our code.

  //  The second parameter is the URL of the image (relative)
  for(var i = 1;i < 10;i++){
    game.load.image('space_'+i, 'res/images/space_'+i+'.jpg');
  }
  
  for(var i = 1;i < 3;i++){
    game.load.image('astro_'+i, 'res/sprites/astro_'+i+'.png');
  }
  game.load.image('mf', 'res/sprites/m-falcom.png');
  game.load.image('ss', 'res/sprites/ssconnor.png');

  game.load.audio('music', ['res/music/bg.ogg', 'res/music/bg.mp3']);
  game.load.audio('startup', ['res/sounds/startup.ogg', 'res/sounds/startup.mp3']);
  game.load.audio('pack', ['res/sounds/rocketpack.ogg', 'res/sounds/rocketpack.mp3']);
  game.load.audio('mfs', ['res/sounds/mf.ogg', 'res/sounds/mf.mp3']);
}

function create() {
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVeritcally = true;
  game.scale.refresh();

  startup_snd = game.add.audio('startup');
  startup_snd.play();

  speak("Welcome to outer Space Ember");
  //  This creates a simple sprite that is using our loaded image and
  //  displays it on-screen
  space = game.add.sprite(0, 0, 'space_'+bg);
  mf = game.add.sprite(-500, -500, 'mf');
  ss = game.add.sprite(game.width/2,game.height + 700, 'ss');
  ss.scale.setTo(.5);
  ss.anchor.setTo(.5);
  //space.scale.setTo(3,3);
  astro = game.add.sprite(centerx, centery, 'astro_1');
  astro.anchor.setTo(0.5, 0.5);
  
  //load sounds
  pack_snd = game.add.audio('pack');
  mfs = game.add.audio('mfs');
  //  Play some music
  music = game.add.audio('music');
  music.play('',0,.3,true);

  // start fullscreen on click
  game.input.onDown.add(go_fullscreen, this);

  game.input.gamepad.start();
  pad1 = game.input.gamepad.pad1;
}

var packplay = 0;
function update(){
  //this is where things are updated
  if(pad1.justPressed(1,100)){
    ro = ro * -1;
  }
  astro.angle += ro;

  if(pad1.buttonValue(2)){
    matrix("Power Boost!!!");
    boost = 2;
    if(packplay == 0){
      packplay = 1;
      pack_snd.play('',0,1,true);
    }
  }else{
    boost = 0;
    pack_snd.stop();
    packplay = 0;
  }

  //m-falcom
  if(pad1.justPressed(4) && mfal == 0){
    matrix(" Here Comes the Millennium Falcon ");
    mfal = 1;
    mfs.play();
    var tween = game.add.tween(mf);
    tween.to({ x: 3000, y : 2000 }, 8000, 'Linear', true, 0); 
    tween.onComplete.add(function(){
      mf.position.x = -500;
      mf.position.y = -500;
      mfal = 0;
    });
  }

  //ssconnor
  if(pad1.justPressed(0) && sscon == 0){
    matrix(" SS Connor is Blasting Off "); 
    sscon = 1;
    mfs.play();
    var tween2 = game.add.tween(ss);
    tween2.to({ y : -2000 }, 8000, 'Linear', true, 0);
    tween2.onComplete.add(function(){
      ss.position.y = game.height + 700;
      sscon = 0;
    });
  }

  //change BG
  if(pad1.justPressed(5)){
    changeBG();
  }

  //change ASTRO
  if(pad1.justPressed(3)){
    changeAstro();
  }

  //move left and right
  if(pad1.axis(2) == -1){
    astro.x+=speed+boost;
  }else if(pad1.axis(2) == 1){
    astro.x-=speed+boost;
  }

  //move up and down
  if(pad1.axis(0) == 1){
    astro.y+=speed+boost;
  }else if(pad1.axis(0) == -1){
    astro.y-=speed+boost;
  }

  if(astro.x < 0){ astro.x = 0 }
  if(astro.x > game.width){ astro.x = game.width}
  if(astro.y < 0){ astro.y = 0 }
  if(astro.y > game.height){ astro.y = game.height}
}

function go_fullscreen(){
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.startFullScreen();
}


function speak(msg){
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance(msg);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  }
}

function matrix(msg){
  if(msgset == 0){ 
    $.get("http://192.168.1.12",{msg:msg},function(data){
      console.log(data);
    });
    msgset = 1;
    setTimeout(function(){ 
      $.get("http://192.168.1.12",{msg:"Mission Control to Ember"},function(data){
        console.log(data);
      });
      msgset = 0; 
    }, 15000);
  }

}


function changeBG(){
  matrix(" Wormhole Found ");
  bg = Math.floor((Math.random() * 9) + 1);
  space.loadTexture('space_'+bg);
}

function changeAstro(){
  if(changeA == 0){
    changeA = 1;
    a++;
    if(a>numof){a=1}
    astro.loadTexture('astro_'+a);
    setTimeout(function(){changeA=0},500);
  }

}
