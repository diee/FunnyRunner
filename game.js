var
    canvas,
    ctx,
    width,
    height,

    fgpos = 0,
    frames = 0,
    score = 0,
    best = 0,

    Bronze = 5,
    Silver = 10,
    Gold = 15,
    Platinum = 20,
    cntJump = 0,
    nivel = 0,
    currentstate,
    states = {
        Splash: 0, Game: 1, Score: 2
    },

    okbutton,


    dog = {

        x: 80,
        y: 0,
        frame: 0,
        velocity: 0,
        animation: [0, 1, 2, 1],
        rotation: 0,
        radius: 12,
        gravity: 0.25,
        _jump: 5.1,

        jump: function () {
            this.velocity = -this._jump;
        },

        update: function () {
            //estos son los valores con los que el pajaro mueve las alas
            var n = currentstate === states.Splash ? 20 : 15;
            this.frame += frames % n === 0 ? 1 : 0;
            this.frame %= this.animation.length;

               //el 280 es la posicion al iniciar el juego. 
            if (currentstate == states.Splash) {
                this.y = height - 235 + 5 * Math.cos(frames / 10);
                this.rotation = 0;
            } else if(currentstate == states.Game){
               this.velocity += this.gravity;
                this.y += this.velocity;
                  if (this.y >= height - s_fg.height - 10) {
                    this.y = height - s_fg.height - 10;
                     cntJump=0;
                }
            }
            else{
                this.velocity += this.gravity;
                this.y += this.velocity;
                this.rotation =1.7;
                this.y = 240;
                this.x=120;
                if (this.y >= height - s_fg.height - 10) {
                    this.y = height - s_fg.height - 10;
                    if (currentstate === states.Game) {
                        //si toca el suelo va a estado Score (o sea, termina el juego)
                        //currentstate = states.Score;

                        //nueva funcion: cuando toca el suelo le permito hacer 2 saltos
                        cntJump=0;
                    }
                    this.velocity = this._jump;
                }

                if (this.velocity >= this._jump) {
                    this.frame = 1;
                    //esta funcion hace que el sprite rote con orientacion caida.
                    //this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
                } else {
                    this.rotation = -0.1;
                }
            }

        },

        draw: function (ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            var n = this.animation[this.frame];
            s_dog[n].draw(ctx, -s_dog[n].width / 2, -s_dog[n].height+12);
            ctx.restore();
        }
    },


    pipes = {
        _pipes: [],

        reset: function () {
            this._pipes = [];
        },

        update: function () {
            var altura= 30;
            //dificultades 
            var framesvalue;
            if(score ===0){
                framesvalue =80;    
            }else if(score >=2 && score <6){
                framesvalue = 100;
                altura = 20;
            }else if(score >=7){
                framesvalue = 90;
            }


            if (frames % framesvalue === 0) {
                // altura de obstaculos
                var _y = height - (s_pipeSouth.height + s_fg.height + 80 + altura * Math.random());
                this._pipes.push({
                    x: 500,
                    y: _y,
                    width: s_pipeSouth.width,
                    height: s_pipeSouth.height
                });
            }

            for (var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];
                if (i === 0) {

                    score += p.x === dog.x ? 1 : 0;

                    var cx = Math.min(Math.max(dog.x, p.x), p.x + p.width);
                    var cy1 = Math.min(Math.max(dog.y, p.y), p.y + p.height);
                    var cy2 = Math.min(Math.max(dog.y, p.y + p.height + 80), p.y + 2 * p.height - 80);

                    var dx = dog.x - cx;
                    var dy1 = dog.y - cy1;
                    var dy2 = dog.y - cy2;

                    var d1 = dx * dx + dy1 * dy1;
                    var d2 = dx * dx + dy2 * dy2;

                    var r = dog.radius * dog.radius;


                    //Valida si choca el sprite con el pipe
                    //if (r > d1 || r > d2) {
                    //    currentstate = states.Score;
                    //}
                     if (r > d2) {
                        currentstate = states.Score;
                    }
                }

                p.x -= 2;
                if (p.x < -50) {
                    this._pipes.splice(i, 1);
                    i--;
                    len--;
                }
            }
        },

        draw: function (ctx) {
            for (var i = 0, len = this._pipes.length; i < len; i++) {
                var p = this._pipes[i];
                //s_pipeSouth.draw(ctx, p.x, p.y);
                s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height);
            }
        }
    };

var onpress = function onpress(evt) {
    cntJump++;
    switch (currentstate) {

        case
        states.Splash:

            currentstate = states.Game;
            dog.jump();
            break;

        case
        states.Game:

         var mx = evt.offsetX, my = evt.offsetY;

            if (mx == null || my == null) {
                mx = evt.touches[0].clientX;
                my = evt.touches[0].clientY;
                alert("mx: "+mx + " my: "+my);
            }

            if (okbutton.x < mx && mx < okbutton.x + okbutton.width &&
                okbutton.y < my && my < okbutton.y + okbutton.height) {
                pipes.reset();
                currentstate = states.Splash;
                score = 0;
            }
        
            if(cntJump <3)
            dog.jump();
            break;

        case
        states.Score:
            var mx = evt.offsetX, my = evt.offsetY;

            if (mx == null || my == null) {
                mx = evt.touches[0].clientX;
                my = evt.touches[0].clientY;
                alert("mx: "+mx + " my: "+my);
            }

            if (okbutton.x < mx && mx < okbutton.x + okbutton.width &&
                okbutton.y < my && my < okbutton.y + okbutton.height) {
                pipes.reset();
                currentstate = states.Splash;
                score = 0;
            }
            break;
    }
}


var main = function main() {
    canvas = document.createElement("canvas");

    width = window.innerWidth;
    height = window.innerHeight;
    var evt = "touchstart";

    if (height >= 500) {
        width = 480;
        height = 320;
        canvas.style.border = "1px solid #000";
        evt = "mousedown";
    }

    document.addEventListener(evt, onpress);


    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    currentstate = states.Splash;

    document.body.appendChild(canvas);

    var img = new Image();

    img.onload = function () {
        initSprites(this);
        ctx.fillStyle = s_bg.color;

        okbutton = {
            x: (width - s_buttons.Ok.width) / 2,
            y: height - 200,
            width: s_buttons.Ok.width,
            height: s_buttons.Ok.height
        }


        run();

    }

    img.src = "res/sheet.png";
}

var run = function run() {
    var loop = function () {
        update();
        render();
        window.requestAnimationFrame(loop, canvas);

    }
    window.requestAnimationFrame(loop, canvas);

}

var update = function update() {
    frames++;

    if (currentstate !== states.Score) {
        fgpos = (fgpos - 2) % 10;

    } else {
        best = Math.max(best, score);
    }

    if (currentstate === states.Game) {
        pipes.update();
    }


    dog.update();

}

var render = function render() {
    ctx.fillRect(0, 0, width, height);
    s_bg.draw(ctx, 0, height - s_bg.height);
    s_bg.draw(ctx, s_bg.width, height - s_bg.height);

    //Dibujo personaje y pipes cuando esta en estado juego
   /* if (currentstate === states.Game) {
         dog.draw(ctx);
         pipes.draw(ctx);
    }*/

    dog.draw(ctx);
    pipes.draw(ctx);

    s_fg.draw(ctx, fgpos, height - s_fg.height);
    s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);
 s_buttons.Rate.draw(ctx, okbutton.x, okbutton.y + 78);
    var width2 = width / 2;

    if (currentstate === states.Splash) {
        dog.draw(ctx);
        s_splash.draw(ctx, width2 - s_splash.width / 2, height - 300);
        s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width / 2, height - 380);
    }

    if (currentstate === states.Score) {
        dog.draw(ctx);
        s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width / 2, height - 300);
        s_score.draw(ctx, width2 - s_score.width / 2, height - 240);
        s_buttons.Ok.draw(ctx, okbutton.x, okbutton.y + 78);

        s_numberS.draw(ctx, width2 - 47, height - 164, score, null, 10);
        s_numberS.draw(ctx, width2 - 47, height - 207, best, null, 10);

       /* if (score >= Bronze && score < Silver) {
            s_medals.Bronze.draw(ctx, width2 / 2 - 9, height - 182);
        } else if (score >= Silver && score < Gold) {
            s_medals.Silver.draw(ctx, width2 / 2 - 9, height - 182);
        } else if (score >= Gold && score < Platinum) {
            s_medals.Gold.draw(ctx, width2 / 2 - 9, height - 182);
        } else if (score >= Platinum) {
            s_medals.Platinum.draw(ctx, width2 / 2 - 9, height - 182);
        }*/


    } else {
        s_numberB.draw(ctx, null, 20, score, width2);
    }

}

main();

