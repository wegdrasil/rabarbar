var game;
var pokemon = [3];
var t = 0;
var move = false;
var amp = 1;

function movement()
{
	move = document.getElementById("anim-chbx").checked; 
}

function amplitude()
{
	amp = parseInt(document.getElementById("anim-rng").value); 
	console.log(amp);
}

function main ()
{
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
}

function preload()
{
	game.load.spritesheet("p0", "sprites/sprite0.png", 16, 16);
	game.load.spritesheet("p1", "sprites/sprite1.png", 32, 32);
	game.load.spritesheet("p2", "sprites/sprite2.png", 32, 32);

	game.stage.setBackgroundColor("#8EA86C");
	game.stage.smoothed = false;
}

function create()
{
	pokemon[0] = game.add.sprite(200, 200, "p0");
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
	if(move)
	{
		t += 0.075;

		pokemon[0].position.x += amp*Math.sin((2*t) + (Math.PI/2));
		pokemon[0].position.y += amp*Math.sin((1*t));

		pokemon[1].position.x += amp*Math.sin((2*t) + (Math.PI/2));
		pokemon[1].position.y += amp*Math.sin((3*t));

		pokemon[2].position.x += amp*Math.sin((4*t) + (Math.PI/2));
		pokemon[2].position.y += amp*Math.sin((5*t));
	}
}
