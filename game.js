var game;
var cursors;
var enter;

var fireButton;
var score = 0;
var scoreString = '';
var scoreText;
var lives = 3;

var player;
var invaders;
var invaderkilled_sfx;

var kaboom;

var rocket = {"ph_object": null, "sfx":null, "isStillGoing": false};

var starfield;

function main()
{
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });
}

function preload()
{
	game.load.image("ship", "sprites/ship.png");
	game.load.image("rocket", "sprites/rocket.png");
	game.load.audio("shoot_sfx", "sounds/shoot.wav");
	game.load.audio("invaderkilled_sfx", "sounds/invaderkilled.wav");


	game.load.spritesheet("invader0", "sprites/invader0.png", 32, 32);
	game.load.spritesheet("invader1", "sprites/invader1.png", 32, 32);
	game.load.spritesheet("invader2", "sprites/invader2.png", 32, 32);
	game.load.spritesheet("kaboom", "sprites/kaboom.png", 32, 32);

	game.load.image("starfield", "sprites/starfield.png");
	
	game.stage.smoothed = false;
}

function create()
{
	cursors = game.input.keyboard.createCursorKeys();
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	starfield = game.add.tileSprite(0, 0, 800, 600, "starfield");
    
    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '10px Arial', fill: '#fff' });

    //  Lives
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '10px Arial', fill: '#fff' });

	player = game.add.sprite(375, 550, "ship");
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	rocket.ph_object = game.add.sprite(387, 550, "rocket");
	game.physics.arcade.enable(rocket.ph_object);
	rocket.ph_object.body.collideWorldBounds = true;
	//rocket.ph_object.visible = false;
	rocket.sfx = game.add.audio('shoot_sfx');
    rocket.sfx.allowMultiple = true;

    invaders = game.add.group();
    invaders.enableBody = true;

    for(var i = 0; i < 10; i++)
    {

    	var invader = invaders.create((i * 50)+64, 32, "invader2");
    	invader.animations.add("inv-a1", [0,1], 5, true);
    	invader.play("inv-a1");

    	var invader = invaders.create((i * 50)+64, 64, "invader2");
    	invader.animations.add("inv-a1", [0,1], 5, true);
    	invader.play("inv-a1");

    	var invader = invaders.create((i * 50)+64, 96, "invader1");
    	invader.animations.add("inv-a2", [0,1], 5, true);
    	invader.play("inv-a2");

    	var invader = invaders.create((i * 50)+64, 128, "invader1");
    	invader.animations.add("inv-a2", [0,1], 5, true);
    	invader.play("inv-a2");

    	var invader = invaders.create((i * 50)+64, 160, "invader0");
    	invader.animations.add("inv-a3", [0,1], 5, true);
    	invader.play("inv-a3");

    	var invader = invaders.create((i * 50)+64, 192, "invader0");
    	invader.animations.add("inv-a3", [0,1], 5, true);
    	invader.play("inv-a3");

    }

    var tween = game.add.tween(invaders).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onLoop.add(function descend(){invaders.y += 10;}, this);
   
    invaderkilled_sfx = game.add.audio("invaderkilled_sfx");
    invaderkilled_sfx.allowMultiple = true;

}

function update()
{
	starfield.tilePosition.y += 2;

	player.body.velocity.x = 0;
	rocket.ph_object.body.velocity.x = 0;
	
	if(cursors.left.isDown)	{
		player.body.velocity.x = -200;
		if(!rocket.isStillGoing)
			rocket.ph_object.body.velocity.x = -200;
	}
	if(cursors.right.isDown) {
		player.body.velocity.x = +200;	
		if(!rocket.isStillGoing)
			rocket.ph_object.body.velocity.x = +200;
	}
	if(fireButton.isDown && !rocket.isStillGoing)
	{
		rocket.ph_object.body.velocity.y = -1000;
		rocket.ph_object.position.x = player.position.x + 12;
		rocket.ph_object.position.y = player.position.y + 16;
		rocket.isStillGoing = true;
		//rocket.ph_object.visible = true;
		rocket.sfx.play();
	}
	if(rocket.ph_object.body.blocked.up)
	{
		console.log("batman");
		rocket.ph_object.body.velocity.y = 0;
		rocket.ph_object.position.x = player.position.x + 12;
		rocket.ph_object.position.y = player.position.y + 16;
		rocket.isStillGoing = false;	
		//rocket.ph_object.visible = false;
	}

	game.physics.arcade.overlap(rocket.ph_object, invaders, killInvader, null,this );

	if(enter.isDown)
	{
		player.position.x = 0;
		player.position.y = 0;

		rocket.ph_object.position.x = 0;
		rocket.ph_object.position.y = 0;
	}
}

function render() {

    //game.debug.spriteBounds(rocket.ph_object);
    //game.debug.spriteBounds(player);
    //game.debug.spriteInfo(rocket.ph_object, 32, 32);

}

function killInvader(r, invader)
{
	invaderkilled_sfx.play();

	rocket.ph_object.body.velocity.y = 0;
	 
	rocket.ph_object.position.x = player.position.x + 12;
	rocket.ph_object.position.y = player.position.y + 16;

	rocket.isStillGoing = false;	

	kaboom = game.add.sprite(invader.world.x, invader.world.y, "kaboom");
	var anim = kaboom.animations.add("kaboom-anim", [ 0, 1, 2, 3 ], 15, false);
	anim.killOnComplete = true;

	kaboom.animations.play("kaboom-anim");
	
	invader.kill();

	score += 1;
	scoreText.text = scoreString + score;
}