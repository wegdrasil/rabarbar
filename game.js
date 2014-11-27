//Dodaj interakcję: obiekt gracza poruszany myszką lub klawiaturą oraz reakcja na kolizję z innymi obiektami.

var game;
var cursors;
var fireButton;

var player;
var invader = [2];
var rocket = {"ph_object": null, "sfx":null, "isStillGoing": false};

function main ()
{
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
}

function preload()
{
	game.load.image("ship", "sprites/ship.png");
	game.load.image("rocket", "sprites/rocket.png");
	game.load.audio("shoot_sfx", "sounds/shoot.wav");

	game.load.spritesheet("invader0", "sprites/invader0.png", 32, 32);

	//game.stage.setBackgroundColor("#8EA86C");
	game.stage.smoothed = false;
}

//TODO(weg): Gather invaders in a phaser group.
function create()
{
	cursors = game.input.keyboard.createCursorKeys();

	player = game.add.sprite(375, 550, "ship");
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	rocket.ph_object = game.add.sprite(375, 550, "rocket");
	game.physics.arcade.enable(rocket.ph_object);
	rocket.ph_object.body.collideWorldBounds = true;
	rocket.ph_object.visible = false;
	rocket.sfx = game.add.audio('shoot_sfx');
    rocket.sfx.allowMultiple = true;

	invader[0] = game.add.sprite(0, 0, "invader0");
	invader[0].animations.add("anim0", [ 0, 1], 10, true);
	invader[0].animations.play("anim0");

	game.physics.arcade.enable(invader[0]);
	invader[0].body.velocity.x = +100;

	invader[1] = game.add.sprite(32, 32, "invader0");
	invader[1].animations.add("anim0", [ 0, 1], 10, true);
	invader[1].animations.play("anim0");
	game.physics.arcade.enable(invader[1]);
	invader[1].body.velocity.x = +100;

	invader[0].body.collideWorldBounds = true;
	invader[1].body.collideWorldBounds = true;

	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update()
{
	player.body.velocity.x = 0;
	rocket.ph_object.body.velocity.x = 0;
	
	if(cursors.left.isDown)	{
		player.body.velocity.x = -150;
		rocket.ph_object.body.velocity.x = -150;
	}
	if(cursors.right.isDown) {
		player.body.velocity.x = +150;	
		rocket.ph_object.body.velocity.x = +150;
	}
	if(fireButton.isDown && !rocket.isStillGoing)
	{
		rocket.ph_object.body.velocity.y = -1000;
		rocket.ph_object.position.x = player.position.x;
		rocket.isStillGoing = true;
		rocket.ph_object.visible = true;
		rocket.sfx.play();
	}
	if(rocket.ph_object.body.blocked.up)
	{
		rocket.ph_object.body.velocity.y = 0;
		rocket.ph_object.position.x = player.position.x;
		rocket.ph_object.position.y = player.position.y;
		rocket.isStillGoing = false;	
		rocket.ph_object.visible = false;
	}

	if(invader[0].body.blocked.right) {
		invader[0].body.velocity.x = -100;	
	}
	else if(invader[0].body.blocked .left) {
		invader[0].body.velocity.x = +100;
	}

	if(invader[1].body.blocked .right) {
		invader[1].body.velocity.x = -100;	
	}
	else if(invader[1].body.blocked .left) {
		invader[1].body.velocity.x = +100;
	}
}
