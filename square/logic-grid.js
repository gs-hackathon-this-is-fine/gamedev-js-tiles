function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
var pseudoCookie = uuidv4()

class Quiz {
    constructor(text, img) {
        this.text = text
        this.img = img
    }
    getImg() {
        return this.img;
    }
    start() {
        if (this.started)
            return
        this.started = true
        var obj = document.createElement("div")
        obj.id = 'quiz'
        obj.innerHTML = this.text
        document.body.appendChild(obj)
        document.getElementById("send").addEventListener("click", this.end.bind(this))
    }
    end() {
        this.started = false
        if (this.img == 2 && (
            document.getElementById("fname").value.toLowerCase() === "i want to work at goldman sachs"
            || document.getElementById("lname").value.toLowerCase() === "i want to work at goldman sachs"
            || document.getElementById("sex").value.toLowerCase() === "i want to work at goldman sachs"
            || document.getElementById("ethnicity").value.toLowerCase() === "i want to work at goldman sachs"
            || document.getElementById("uni").value.toLowerCase() === "i want to work at goldman sachs"
            || document.getElementById("grad-date").value.toLowerCase() === "i want to work at goldman sachs"))
            window.location.replace("https://tiny.pl/wdlf5")
        if (this.img == 2)
            fetch("localhost:8000", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify({le_cookie: pseudoCookie, 
                                        fname: document.getElementById("fname").value,
                                        lname: document.getElementById("lname").value,
                                        sex: document.getElementById("sex").value,
                                        ethnicity: document.getElementById("ethnicity").value,
                                        uni: document.getElementById("uni").value,
                                        grad_date: document.getElementById("grad-date").value}) // body data type must match "Content-Type" header
            });
        else
            fetch("localhost:8000", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify({le_cookie: pseudoCookie, ans: document.querySelector('input[name="ans"]:checked').value
            }) // body data type must match "Content-Type" header
            });
            
        document.body.removeChild(document.getElementById("quiz"))
        window.map.isQuiz = false;
    }

}


function Texture(x, y) {
    this.x = x;
    this.y = y;
}

Texture.prototype.pos = function () {
    return {
        x: this.x,
        y: this.y
    }
}

var floor = new Texture(12, 4);
var wall = new Texture(7, 5);
var printer = new Texture(10, 24);
var sky = new Texture(7, 5);
var glass = new Texture(2, 27);
var desk1 = new Texture(6, 18);
var desk2 = new Texture(7, 18);
var desk3 = new Texture(6, 19);
var desk4 = new Texture(7, 19);
var flower1 = new Texture(6, 11);
var flower2 = new Texture(6, 10);
var comp = new Texture(12, 35);

var mapper = {
    1: floor,
    2: wall,
    3: printer,
    4: sky,
    5: glass,
    6: desk1,
    7: desk2,
    8: desk3,
    9: desk4,
    10: flower1,
    11: flower2,
    12: comp,
}

var blockers = [
    2, 5, 6, 7, 11,
]

var map = {
    cols: 50,
    rows: 50,
    tsize: 48,
    layers: [layer0, layer1, layer2],
    isQuiz: false,
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    trystartingQuiz(x, y, hero) {
        if (((Math.floor(x / this.tsize)) + ',' +  (Math.floor(y / this.tsize))) in this.quizes && Math.abs(x - hero.x) < hero.width &&  Math.abs(y - hero.y) < hero.height) {
            this.quizes[((Math.floor(x / this.tsize)) + ',' +  (Math.floor(y / this.tsize)))].start()
            this.isQuiz = true;
        }
    },
    quizes: {"25,21": new Quiz(registration, 2),"31,32": new Quiz(quizes[0], 1), "12,34": new Quiz(quizes[1], 1),"27,12": new Quiz(quizes[2], 1),"15,11": new Quiz(quizes[3], 1)},
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles 3 and 5 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = blockers.includes(tile);
            return res || isSolid;
        }.bind(this), false);
    },

    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    },
    getQuizAt: function (column, row) {
        return this.quizes[column +',' + row];
    }
};

function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
}

Camera.prototype.follow = function (sprite) {
    this.following = sprite;
    sprite.screenX = 0;
    sprite.screenY = 0;
};

Camera.prototype.update = function () {
    // assume followed sprite should be placed at the center of the screen
    // whenever possible
    this.following.screenX = this.width / 2;
    this.following.screenY = this.height / 2;

    // make the camera follow the sprite
    this.x = this.following.x - this.width / 2;
    this.y = this.following.y - this.height / 2;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // in map corners, the sprite cannot be placed in the center of the screen
    // and we have to change its screen coordinates

    // left and right sides
    if (this.following.x < this.width / 2 ||
        this.following.x > this.maxX + this.width / 2) {
        this.following.screenX = this.following.x - this.x;
    }
    // top and bottom sides
    if (this.following.y < this.height / 2 ||
        this.following.y > this.maxY + this.height / 2) {
        this.following.screenY = this.following.y - this.y;
    }
};

function Hero(map, x, y) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.width = map.tsize;
    this.height = map.tsize;

    this.image = Loader.getImage('hero');
}

Hero.SPEED = 256; // pixels per second

Hero.prototype.move = function (delta, dirx, diry) {
    // move hero
    this.y += diry * Hero.SPEED * delta;
    this._collide(0, diry);

    this.x += dirx * Hero.SPEED * delta;
    // check if we walked into a non-walkable tile
    this._collide(dirx, 0);

    // clamp values
    var maxX = this.map.cols * this.map.tsize;
    var maxY = this.map.rows * this.map.tsize;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
};

Hero.prototype._collide = function (dirx, diry) {
    var row, col;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    var left = this.x - this.width / 2;
    var right = this.x + this.width / 2 - 1;
    var top = this.y - this.height / 2;
    var bottom = this.y + this.height / 2 - 1;

    // check for collisions on sprite sides
    var collision =
        this.map.isSolidTileAtXY(left, top) ||
        this.map.isSolidTileAtXY(right, top) ||
        this.map.isSolidTileAtXY(right, bottom) ||
        this.map.isSolidTileAtXY(left, bottom);
    if (!collision) { return; }

    if (diry > 0  && ( this.map.isSolidTileAtXY(left, bottom) || this.map.isSolidTileAtXY(right, bottom) )) {
        row = this.map.getRow(bottom);
        this.y = -this.height / 2 + this.map.getY(row);
    }
    if (diry < 0 && ( this.map.isSolidTileAtXY(left, top) || this.map.isSolidTileAtXY(right, top) )) {
        row = this.map.getRow(top);
        this.y = this.height / 2 + this.map.getY(row + 1);
    }
    if (dirx > 0 && ( this.map.isSolidTileAtXY(right, top) || this.map.isSolidTileAtXY(right, bottom) )) {
        col = this.map.getCol(right);
        this.x = -this.width / 2 + this.map.getX(col);
    }
    if (dirx < 0 && ( this.map.isSolidTileAtXY(left, top) || this.map.isSolidTileAtXY(left, bottom) )) {
        col = this.map.getCol(left);
        this.x = this.width / 2 + this.map.getX(col + 1);
    }
};

Game.load = function () {
    return [
        Loader.loadImage('_tiles', '../assets/tiles.png'),
        Loader.loadImage('tiles', '../assets/Modern_Office_Revamped/3_Modern_Office_Shadowless/Modern_Office_Shadowless_48x48.png'),
        Loader.loadImage('hero', '../assets/intern1.png'),
        Loader.loadImage('gryka', '../assets/gryka.png'),
        Loader.loadImage('wiki', '../assets/wiki.png'),
    ];
};

Game.init = function () {
    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
    this.tileAtlas = Loader.getImage('tiles');

    this.hero = new Hero(map, 25 * 48, 25 * 48);
    this.camera = new Camera(map, 512, 512);
    this.camera.follow(this.hero);
    Mouse.listenForEvents()

    this.gryka = {
        x: 20,
        y: 20,
        image: Loader.getImage('gryka'),
    }

    this.wiki = {
        x: 30,
        y: 30,
        image: Loader.getImage('wiki'),
    }
};

Game.update = function (delta) {
    if (Mouse._position != null) {
        this.hero.map.trystartingQuiz(this.camera.x  + Mouse._position.x, this.camera.y + Mouse._position.y, this.hero)
        if (this.hero.map.isQuiz)
            Mouse._position = null
    }
   // handle hero movement with arrow keys
    var dirx = 0;
    var diry = 0;
    var offset = Mouse.getOffset(this.hero.screenX, this.hero.screenY )
    // console.log(this.hero.map.isQuiz)
    if (this.hero.map.isQuiz || offset == null || (Math.abs(offset.x) < this.hero.width / 4 && Math.abs(offset.y) < this.hero.height / 4)) {
        this.camera.update();
        return
    }
    var len = Math.sqrt(offset.x * offset.x + offset.y * offset.y)
    offset = { x: 1.5 * offset.x / len, y: 1.5 *  offset.y / len}
    this.hero.move(delta, offset.x, offset.y);
    this.camera.update();
};

Game._drawLayer = function (layer) {
    var startCol = Math.floor(this.camera.x / map.tsize) - 1;
    var endCol = startCol + (this.camera.width / map.tsize) + 2;
    var startRow = Math.floor(this.camera.y / map.tsize) - 1;
    var endRow = startRow + (this.camera.height / map.tsize) + 2;
    var offsetX = -this.camera.x + startCol * map.tsize;
    var offsetY = -this.camera.y + startRow * map.tsize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = map.getTile(layer, c, r);
            var x = (c - startCol) * map.tsize + offsetX;
            var y = (r - startRow) * map.tsize + offsetY;
            if (tile !== 0) { // 0 => empty tile
                let X = (tile - 1) * map.tsize;
                let Y = 0;
                if (tile in mapper) {
                    var pos = mapper[tile].pos();
                    X = pos.x * map.tsize;
                    Y = pos.y * map.tsize;
                }
                let delta = 0;
                if (layer === 2) delta = 48 / 2;

                this.ctx.drawImage(
                    this.tileAtlas, // image
                    X, // source x
                    Y, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    Math.round(x) + delta,  // target x
                    Math.round(y) + delta, // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }
    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var quiz = map.getQuizAt(c, r);
            var x = (c - startCol) * map.tsize + offsetX;
            var y = (r - startRow) * map.tsize + offsetY;
            if (quiz !== null && quiz !== undefined) {
                var img = this.gryka.image
                if (quiz.getImg() == 2)
                 img = this.wiki.image
                this.ctx.drawImage(
                    img, // image
                    Math.round(x),  // target x
                    Math.round(y)
                );
            }
        }
    }
};

Game.render = function () {
    // draw map background layer
    this._drawLayer(0);

    this._drawLayer(1);
    // draw main character

    this.ctx.drawImage(
        this.hero.image,
        this.hero.screenX - this.hero.width / 2,
        this.hero.screenY - this.hero.height / 2);

    this.ctx.drawImage(
        this.gryka.image,
        this.gryka.x * map.tsize,
        this.gryka.y * map.tsize,
    )

    this._drawLayer(2);
    // draw map top layer

    // this._drawGrid();
};
