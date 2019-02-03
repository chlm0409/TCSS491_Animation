function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}




Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}






function AnimationWalk(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale, startX, startY) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;

    this.startX = startX;
    this.startY = startY;
}

AnimationWalk.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth; // column
    yindex = Math.floor(frame / this.sheetWidth);// row

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

AnimationWalk.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

AnimationWalk.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}

//spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse

function soldier(game) {
    // this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/jump.png"), 0, 0, 512/9, 512/9, 0.08, 18, true, true);

    // this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/jump.png"), 0, (512/9)*2, 512/9, 512/9, 0.08, 12, false, true);

    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

soldier.prototype = new Entity();
soldier.prototype.constructor = soldier;

soldier.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

soldier.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}


function Metal_R(game, spritesheet) {
    this.animation = new AnimationWalk(spritesheet, 33, 50, 12, 0.15, 12, true, 3, 2, 0);
    this.speed = 350;
    this.ctx = game.ctx;


    Entity.call(this, game, -1280, 450);

}


Metal_R.prototype = new Entity();
Metal_R.prototype.constructor = Metal_R;

Metal_R.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1280) this.x = -1280;
    Entity.prototype.update.call(this);
}

Metal_R.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, -this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Metal_L(game, spritesheet) {
    this.animation = new AnimationWalk(spritesheet, 39, 60, 16, 0.25, 16, true, 3, 181, 1085);
    this.speed = 350;
    this.ctx = game.ctx;


    Entity.call(this, game, 1280, 250);

}


Metal_L.prototype = new Entity();
Metal_L.prototype.constructor = Metal_L;

Metal_L.prototype.update = function () {

    Entity.prototype.update.call(this);
}

Metal_L.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, 600, this.y);
    Entity.prototype.draw.call(this);
}






function Metal_J(game, spritesheet) {
    this.animation = new AnimationWalk(spritesheet, 48.8, 63, 8, 0.2, 8, true, 3, 6, 750);
    this.speed = 350;
    this.ctx = game.ctx;


    Entity.call(this, game, 1280, 125);

}


Metal_J.prototype = new Entity();
Metal_J.prototype.constructor = Metal_J;

Metal_J.prototype.update = function () {

    this.x += this.game.clockTick * this.speed;
    if (this.x > 1280) this.x = -1280;
    Entity.prototype.update.call(this);}

Metal_J.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/background.jpg");
ASSET_MANAGER.queueDownload("./img/blue.png");
ASSET_MANAGER.queueDownload("./img/red.png");
ASSET_MANAGER.queueDownload("./img/metal.png");
ASSET_MANAGER.queueDownload("./img/Payon_Soldier_noBG.png");
ASSET_MANAGER.queueDownload("./img/jump.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new soldier(gameEngine);
    gameEngine.init(ctx);
    gameEngine.start();
    // gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
    gameEngine.addEntity(new Metal_R(gameEngine, ASSET_MANAGER.getAsset("./img/metal.png")));
    gameEngine.addEntity(new Metal_L(gameEngine, ASSET_MANAGER.getAsset("./img/metal.png")));

    gameEngine.addEntity(new Metal_J(gameEngine, ASSET_MANAGER.getAsset("./img/metal.png")));

});
