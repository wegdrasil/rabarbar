var game;
var cursors;
var enter;

var fireButton;
var score = 0;
var scoreString = '';
var scoreText;
var lives = 3;
var livesText;
var stateText;

var player;
var invaders;
var invaderkilled_sfx;
var playerkilled_sfx;

var kaboom;

var rocket = {"ph_object": null, "sfx":null, "isStillGoing": false};
var enemyBullets;

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
	game.load.audio("playerkilled_sfx", "sounds/explosion.wav");
	

	game.load.spritesheet("invader0", "sprites/invader0.png", 32, 32);
	game.load.spritesheet("invader1", "sprites/invader1.png", 32, 32);
	game.load.spritesheet("invader2", "sprites/invader2.png", 32, 32);
	game.load.spritesheet("kaboom", "sprites/kaboom.png", 32, 32);
	game.load.spritesheet("bullet", "sprites/enemyBullet.png", 32, 32);
	game.load.image("starfield", "sprites/starfield.png");
	
	game.stage.smoothed = false;
}

function create()
{
	cursors = game.input.keyboard.createCursorKeys();
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	starfield = game.add.tileSprite(0, 0, 800, 600, "starfield");
    

    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '16px Arial', fill: '#fff' });

    livesText = game.add.text(game.world.width - 100, 10, 'Lives : ' + lives, { font: '16px Arial', fill: '#fff' });

	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '32px Arial', fill: '#fff' });
	stateText.anchor.setTo(0.5, 0.5);
	stateText.visible = false;

	player = game.add.sprite(375, 550, "ship");
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	rocket.ph_object = game.add.sprite(387, 550, "rocket");
	game.physics.arcade.enable(rocket.ph_object);
	rocket.ph_object.body.collideWorldBounds = true;
	rocket.sfx = game.add.audio('shoot_sfx');
    rocket.sfx.allowMultiple = true;

    invaders = game.add.group();
    invaders.enableBody = true;

    for(var i = 0; i < 10; i++)
    {

    	var invader = invaders.create((i * 50)+64, 32, "invader2");
    	invader.animations.add("inv-a1", [0,1], 5, true);
    	invader.play("inv-a1");
    	invader.outOfBoundsKill = true;
    	invader.checkWorldBounds = true;
    	invader.events.onOutOfBounds.add( killOnBoundary, this );

    	var invader = invaders.create((i * 50)+64, 64, "invader2");
    	invader.animations.add("inv-a1", [0,1], 5, true);
    	invader.play("inv-a1");

		invader.outOfBoundsKill = true;
    	invader.checkWorldBounds = true;
    	invader.events.onOutOfBounds.add( killOnBoundary, this );

    	var invader = invaders.create((i * 50)+64, 96, "invader1");
    	invader.animations.add("inv-a2", [0,1], 5, true);
    	invader.play("inv-a2");

		invader.outOfBoundsKill = true;
    	invader.checkWorldBounds = true;
    	invader.events.onOutOfBounds.add( killOnBoundary, this );


    	var invader = invaders.create((i * 50)+64, 128, "invader1");
    	invader.animations.add("inv-a2", [0,1], 5, true);
    	invader.play("inv-a2");
		invader.outOfBoundsKill = true;
    	invader.checkWorldBounds = true;
    	invader.events.onOutOfBounds.add( killOnBoundary, this );


    	var invader = invaders.create((i * 50)+64, 160, "invader0");
    	invader.animations.add("inv-a3", [0,1], 5, true);
    	invader.play("inv-a3");
		invader.outOfBoundsKill = true;
    	invader.checkWorldBounds = true;
    	invader.events.onOutOfBounds.add( killOnBoundary, this );


    	var invader = invaders.create((i * 50)+64, 192, "invader0");
    	invader.animations.add("inv-a3", [0,1], 5, true);
    	invader.play("inv-a3");
		invader.outOfBoundsKill = true;
    	invader.checkWorldBounds = true;
    	invader.events.onOutOfBounds.add( killOnBoundary, this );

    }

    var tween = game.add.tween(invaders).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onLoop.add(function descend(){invaders.y += 20;}, this);

   
    invaderkilled_sfx = game.add.audio("invaderkilled_sfx");
    invaderkilled_sfx.allowMultiple = true;

    playerkilled_sfx = game.add.audio("playerkilled_sfx");
    playerkilled_sfx.allowMultiple = true;

    enemyBullets = game.add.group();
	enemyBullets.enableBody = true;
	enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	enemyBullets.createMultiple(60, "bullet");
	enemyBullets.setAll('anchor.x', 0.5);
	enemyBullets.setAll('anchor.y', 1);
	enemyBullets.setAll('outOfBoundsKill', true);
	enemyBullets.setAll('checkWorldBounds', true);
	enemyBullets.callAll('animations.add', 'animations', 'bullet-anim', [0, 1], 5, true);
    enemyBullets.callAll('animations.play', 'animations', 'bullet-anim');

}

function update()
{
	starfield.tilePosition.y += 2;

	player.body.velocity.x = 0;
	rocket.ph_object.body.velocity.x = 0;
	
	if (player.alive)
	{	
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
			rocket.ph_object.position.x = player.world.x + 12;
			rocket.ph_object.position.y = player.world.y + 16;
			rocket.isStillGoing = true;
			rocket.sfx.play();
		}
		if(rocket.ph_object.body.blocked.up)
		{
			console.log("batman");
			rocket.ph_object.body.velocity.y = 0;
			rocket.ph_object.position.x = player.world.x + 12;
			rocket.ph_object.position.y = player.world.y + 16;
			rocket.isStillGoing = false;	
		}
		
		if(game.rnd.frac() > 0.95)
		{
			var enemyBullet = enemyBullets.getFirstExists(false);
			if (enemyBullet)
					invaders.forEachAlive( function (invader) {
					if(game.rnd.frac() > 0.99)
					{
						enemyBullet.reset(invader.world.x, invader.world.y);
						game.physics.arcade.moveToXY(enemyBullet, invader.world.x,invader.world.y + 1000,200);
					}

				}
				);
		}
		if(!game.physics.arcade.overlap(player, invaders, killPlayerByInvader, null, this))
			game.physics.arcade.overlap(rocket.ph_object, invaders, killInvader, null,this );

		game.physics.arcade.overlap(enemyBullets, player, killPlayerByBullet, null, this);
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
	 
	rocket.ph_object.position.x = player.world.x + 12;
	rocket.ph_object.position.y = player.world.y + 16;

	rocket.isStillGoing = false;	

	kaboom = game.add.sprite(invader.world.x, invader.world.y, "kaboom");
	var anim = kaboom.animations.add("kaboom-anim", [ 0, 1, 2, 3 ], 15, false);
	anim.killOnComplete = true;

	kaboom.animations.play("kaboom-anim");
	
	invader.kill();

	score += 1;
	scoreText.text = scoreString + score;

	if (invaders.countLiving() == 0)
	{
	 	stateText.text = "Click to start new level";
		stateText.visible = true;
		game.input.onTap.addOnce(restart,this);
	}

}

function killOnBoundary(invader)
{
	console.log(invaders.countLiving());
	if (invaders.countLiving() == 1)
	{
		console.log("does it even work?");
	 	stateText.text = "Click to start new level";
		stateText.visible = true;
		game.input.onTap.addOnce(restart,this);
	}
}

function killPlayerByBullet(player, bullet)
{
	playerkilled_sfx.play();
	bullet.kill();
	lives = lives - 1;
	livesText.text = "Lives : " + lives;

	if(lives < 1)
	{
		score = 0;

		player.kill();
		rocket.ph_object.kill();
		invaders.callAll("kill");

		enemyBullets.callAll("kill");
		
		kaboom = game.add.sprite(player.world.x, player.world.y, "kaboom");
		var anim = kaboom.animations.add("kaboom-anim", [ 0, 1, 2, 3 ], 15, false);
		anim.killOnComplete = true;

		kaboom.animations.play("kaboom-anim");

		stateText.text=" GAME OVER \n Click to restart";
		stateText.visible = true;
		game.input.onTap.addOnce(restart,this);
	}
}

function killPlayerByInvader(player, invader)
{
	playerkilled_sfx.play();
	
	lives = 0;
	livesText.text = "Lives : " + lives;

	score = 0;


	enemyBullets.callAll("kill");
	
	kaboom = game.add.sprite(player.world.x, player.world.y, "kaboom");
	var anim = kaboom.animations.add("kaboom-anim", [ 0, 1, 2, 3 ], 15, false);
	anim.killOnComplete = true;

	kaboom.animations.play("kaboom-anim");
	player.kill();

	rocket.ph_object.kill();
	invaders.callAll("kill");
	stateText.text=" GAME OVER \n Click to restart";
	stateText.visible = true;
	game.input.onTap.addOnce(restart,this);
}

function restart ()
{
	invaders.callAll('revive');
	invaders.x = 64;
	invaders.y = 32;

	player.revive();
	if(lives < 1)
	{
		lives = 3;
		livesText.text = "Lives : " + lives;
	}
	scoreText.text = scoreString + score;
	rocket.ph_object.revive();
	stateText.visible = false;
}