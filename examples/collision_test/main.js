var game = {
    // game assets
    assets : [  
        { name: "alien",   type:"image", src:"data/gfx/alien.png" },
        { name: "flushed", type:"image", src:"data/gfx/flushed.png" },
        { name: "scream",  type:"image", src:"data/gfx/scream.png" },
        { name: "smile",   type:"image", src:"data/gfx/smile.png" },
        { name: "smirk",   type:"image", src:"data/gfx/smirk.png" },
        { name: "brick",   type:"image", src:"data/gfx/brick.png" },
        { name: "level",   type:"tmx",   src:"data/map/level.tmx" }
    ],

    onload: function()
    {
        // init the video
        if (!me.video.init('screen', me.video.CANVAS, 1024, 768, true, 'auto')) {
            alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
            return;
        }

        // install the debug panel plugin
        me.plugin.register(debugPanel, "debug");
        me.debug.renderQuadTree = true;

        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all resources to be loaded
        me.loader.preload(game.assets);

        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
    },

    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());

        // switch to PLAY state
        me.state.change(me.state.PLAY);
    }
};

var PlayScreen = me.ScreenObject.extend( {
    onResetEvent: function() {
        me.levelDirector.loadLevel("level");
        // make the collision layer also visible since we also use it for the background
        me.game.currentLevel.getLayerByName("collision").setOpacity(1);
        // set the corresponding flag in the debug panel
        me.debug.renderCollisionMap = true;

        // Add some objects
        for (var i = 0; i < 200; i++) {
            me.game.world.addChild(new Smilie(i), 3);
        }
    }
});

var Smilie = me.Entity.extend({
    init : function (i) {
        this._super(
            me.Entity,
            "init",
            [64 + Math.random() * (1024 - 64 * 2 - 16),
            64 + Math.random() * (768 - 64 * 2 - 16),
            {
                width : 16,
                height : 16,
            }]
        );
        // add the coin sprite as renderable
        this.renderable = new me.Sprite(16, 16, me.loader.getImage(game.assets[i % 5].name));
       
        // add a collision shape
        this.body.addShape(new me.Rect(0, 0, this.width, this.heigth));
    },

    update : function (dt) {
        this.body.update(dt);
        
        me.collision.check(this);

        return this._super(me.Entity, 'update', [dt]);
    }
});
    
/* Bootstrap */
window.onReady(function onReady() {
    game.onload();
});
