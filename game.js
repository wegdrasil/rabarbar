var game;
var pokemon = [3];
var t = 0;

function main ()
{
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
}

function preload()
{
	game.load.spritesheet("p0", "sprites/sprite0.png", 16, 16);
	game.load.spritesheet("p1", "sprites/sprite1.png", 32, 32);
	game.load.spritesheet("p2", "sprites/sprite2.png", 32, 32);

	game.stage.setBackgroundColor("#00ffff");
	game.stage.smoothed = false;
}

function create()
{
	pokemon[0] = game.add.sprite(200, 50, "p0");
	pokemon[0].scale.setTo(3, 3);
	pokemon[0].animations.add("anim0", [ 0, 1, 2, 3 ], 10, true);
	pokemon[0].animations.play("anim0");

	pokemon[1] = game.add.sprite(500, 50, "p1");
	pokemon[1].scale.setTo(3, 3);
	pokemon[1].animations.add("anim1", [ 0, 1, 2, 3 ], 10, true);
	pokemon[1].animations.play("anim1");

	pokemon[2] = game.add.sprite(500, 300, "p2");
	pokemon[2].scale.setTo(3, 3);
	pokemon[2].animations.add("anim2", [ 0, 1, 2, 3 ], 10, true);
	pokemon[2].animations.play("anim2");
}

function update()
{
	t += 0.075;
	pokemon[0].position.x += 20*Math.sin((2*t) + (Math.PI/2));
	pokemon[0].position.y += 20*Math.sin((1*t));

	pokemon[1].position.x += 30*Math.sin((2*t) + (Math.PI/2));
	pokemon[1].position.y += 30*Math.sin((3*t));

	pokemon[2].position.x += 30*Math.sin((4*t) + (Math.PI/2));
	pokemon[2].position.y += 30*Math.sin((5*t));
}