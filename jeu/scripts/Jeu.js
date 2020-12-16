export class Jeu {

    constructor() {

        let codedonner = Math.floor(Math.random() * 2000);

        console.log(codedonner);

        // Instanciation du client Socket.IO pour communiquer avec le serveur
        this.socket = io("https://cgilles.dectim.ca:3005", {
            query: {type: 'jeu', codeJeu: codedonner} // identification en tant que jeu
        });

        this.socket.on("commencer", message => {
            this.commencer(message)
        });

        this.socket.on("recommencerJeu", message => {
            this.commencer(message)
        });
        //  this.socket.on("position", message => {
        //      this.deplacer(message)
        //  });
//

        //  this.socket.on("joueur2", message => {
        //      document.getElementById("messages").innerText += "joueur2: " + JSON.stringify(message) + "\n";
        //  });

        //    this.socket.on("connection", socket => {
        //        socket.on("position", this.deplacer.bind(this));
        //        socket.on("go", this.commencer.bind(this));
        //        socket.on("tirer", this.tirer.bind(this));
        //        socket.on("esquiveDroite", this.esquiveDroite.bind(this));
        //        socket.on("esquiveGauche", this.esquiveGauche.bind(this));
        //        socket.on("mouvement", this.bouger.bind(this));
        //    });

        this.salut = 0;
        this.salut2 = 0;
        this.autorisertirer = 1;
        console.log(this.salut2);
        console.log(this.autorisertirer);
        this.autoriseresquivezduel = true;
        this.Anglereference = null;


        this.canvas = document.querySelector("canvas");
        this
            .precharger("ressources/manifest.json")
            .then(this.initialiserCreateJS.bind(this))
            .catch(erreur => console.error(erreur));


        document.getElementById("chiffre").innerHTML = codedonner;

    }


    precharger(manifeste = "manifest.json") {

        // Renvoi d'une promesse qui s'exécutera à la fin du chargement
        return new Promise((resolve, reject) => {
            this.chargeur = new createjs.LoadQueue();
            this.chargeur.installPlugin(createjs.Sound);
            this.chargeur.addEventListener('complete', resolve);
            this.chargeur.addEventListener('error', reject);
            this.chargeur.loadManifest(manifeste);
        });

    }

    initialiserCreateJS() {
        this.stage = new createjs.Stage(this.canvas);
        createjs.Ticker.on("tick", e => this.stage.update(e));
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        createjs.Sound.stop();
        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        this.musique = createjs.Sound.play('themeRadio', {loop: -1, volume: 0.15});
    }


    commencer() {


        createjs.Sound.stop();
        createjs.Sound.play("oiseau", {volume: 0.75});
        this.musique = createjs.Sound.play('theme', {loop: -1, volume: 0.15});
        this.musique = createjs.Sound.play('ambiance', {loop: -1, volume: 0.10});
        this.musique = createjs.Sound.play('introduction', {volume: 1});
        createjs.Sound.play("confirm", {volume: 1});
        console.log('le jeu commence');
        document.querySelector(".accueil").style.display = "none"
        document.querySelector("canvas").style.display = "block"

        this.intro = this.chargeur.getResult("intro");
        //baliseVideo.loop = true; // optionnel: pour jouer en boucle
        this.intro.muted = true;
        let introVideo = new createjs.Bitmap(this.intro);
        this.stage.addChild(introVideo);
        this.intro.play();

        this.titre = new createjs.Bitmap(this.chargeur.getResult("titre"));
        this.stage.addChild(this.titre);
        this.titre.x = 590;
        this.titre.y = 5;
        this.titre.scale = 0.5;

        this.intro.addEventListener("ended", this.idle.bind(this));

        this.tbk3 = setTimeout(() => {
            this.stage.removeChild(this.titre);
        }, 5700);

    }


    // debutTraining() {
    //     this.debut = this.chargeur.getResult("start");
    //     //baliseVideo.loop = true; // optionnel: pour jouer en boucle
    //     this.debut.muted = true;
    //     this.debutVideo = new createjs.Bitmap(this.debut);
    //     this.stage.addChild(this.debutVideo);
    //     this.debut.play();
    // }


    idle() {

        this.socket.on("mouvement", message => {
            this.bouger(message);
        });


        this.socket.on("tirer", message => {
            this.tirer(message)
        });

        let idle = this.chargeur.getResult("idle");
        idle.loop = true; // optionnel: pour jouer en boucle
        idle.muted = true;
        let idleVideo = new createjs.Bitmap(idle);
        this.stage.addChild(idleVideo);
        idle.play();
        idle.addEventListener("ended", this.idle.bind(this));

        this.tbk4 = setTimeout(() => {
            createjs.Sound.play("decompte", {volume: 0.30});
            this.instruc1 = new createjs.Bitmap(this.chargeur.getResult("instruc1"));
            this.stage.addChild(this.instruc1);
            this.instruc1.x = 0;
            this.instruc1.y = 0;
        }, 2000);

        this.hotspot1 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot1);
        this.hotspot1.x = 793;
        this.hotspot1.y = 395;
        this.hotspot1.scale = 0.75;
        this.hotspot1.alpha = 0.001;


        this.hotspot2 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot2);
        this.hotspot2.x = 1000;
        this.hotspot2.y = 310;
        this.hotspot2.scale = 0.75;
        this.hotspot2.alpha = 0.001;


        this.hotspot3 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot3);
        this.hotspot3.x = 1095;
        this.hotspot3.y = 590;
        this.hotspot3.scale = 0.85;
        this.hotspot3.alpha = 0.001;

        //this.hotspot3000 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        //this.stage.addChild(this.hotspot3000);
        //this.hotspot3000.x = 100;
        //this.hotspot3000.y = 200;
        //this.hotspot3000.scale = 2;
        //this.hotspot3000.alpha = 1;

        //this.hotspot6 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        //this.stage.addChild(this.hotspot6);
        //this.hotspot6.x = 10;
        //this.hotspot6.y = 390;
        //this.hotspot6.scale = 2;
        //this.hotspot6.alpha = 1;

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 950;
        this.cible.y = 500;
        this.cible.scale = 0.15;
        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });

        // this.hotspot4 = new createjs.Bitmap(this.chargeur.getResult('hotspotR'));
        // this.stage.addChild(this.hotspot4);
        // this.hotspot4.x = 0;
        // this.hotspot4.y = 0;
        // this.hotspot4.alpha = 0.50;

    }

    bouger(message) {

        if (!this.Anglereference) {
            this.Anglereference = message.alpha;
        }

        let delta = message.alpha - this.Anglereference;
        // let deltaAngle = this.Anglereference * delta;


        let omega = message.alpha + this.Anglereference;
        // console.log(omega);


        //console.log(message.alpha, message.beta);
        //this.cible.x = delta + 25;

        //this.cible.x = omega - 25;
        this.cible.x = ((message.alpha + 1) / 100 * window.innerWidth);
        this.cible.y = (message.beta * window.innerHeight);


        //message.alpha * Math.PI / 180

        //    let alphax = message.alpha,
        //        betay = message.beta
        //    // gammaz = message.gamma;

        //    if (alpha <= -90) {
        //        this.cible.x = 760

        //    }
        //    if (alpha >= 45) {
        //        this.cible.x = 0
        //    }

        //    if (alpha >= -90 && alpha <= 45) {
        //        this.cible.x = (-(alpha) + 45) / 100 * this.canvas.height;
        //    }


        if (message.beta <= -45) {
            this.cible.y = 760

        }
        if (message.beta >= 45) {
            this.cible.y = 0
        }

        if (message.beta >= -45 && message.beta <= 45) {

            this.cible.y = (-(message.beta) + 45) / 100 * window.innerWidth;

        }


        //  if (message.alpha === 0) {
        //      this.cible.x = 1920;
        //  }


        //  if(message.alpha)

        //  if (message.beta < 0 || message.beta > window.innerHeight) {

        //  }
    }

    //  deplacer(message) {
    //      console.log("jebouge");
//
    //      this.cible.x = message.x
    //      this.cible.y = message.y
//
    //      this.cible.y = (message.ratioY * window.innerHeight) * 2;
    //      this.cible.x = (message.ratioX * window.innerHeight) * 2;
    //  }


    tirer() {

        if (this.autorisertirer === 1) {
            console.log('tirer');
            console.log(this.salut);
            createjs.Sound.play("gunshot", {volume: 0.25});
            if (ndgmr.checkRectCollision(this.cible, this.hotspot3)) {
                createjs.Sound.play("bouteillev1", {volume: 0.35});
                console.log('cursd4erd');

                this.bouteilleD = this.chargeur.getResult("bouteilleG");
                this.bouteilleD.muted = true;
                this.bouteilleDVideo = new createjs.Bitmap(this.bouteilleD);
                this.stage.addChild(this.bouteilleDVideo);
                this.bouteilleD.play();
                this.hotspot3.x = -10;
                this.hotspot3.y = -10;


                if (this.salut === 0) {
                    this.salut++;
                    this.bouteilleD.addEventListener("ended", this.oox.bind(this))
                }


            }
            if (ndgmr.checkRectCollision(this.cible, this.hotspot1)) {
                console.log('cursd4erd');
                createjs.Sound.play("bouteillev2", {volume: 0.35});
                this.bouteilleG = this.chargeur.getResult("bouteilleD");
                this.bouteilleG.muted = true;
                this.bouteilleGVideo = new createjs.Bitmap(this.bouteilleG);
                this.stage.addChild(this.bouteilleGVideo);
                this.bouteilleG.play();
                this.hotspot1.x = -10;
                this.hotspot1.y = -10;

                if (this.salut === 0) {
                    this.salut++;
                    this.bouteilleG.addEventListener("ended", this.xoo.bind(this))
                }


            }
            if (ndgmr.checkRectCollision(this.cible, this.hotspot2)) {
                console.log('cursd4erd');
                createjs.Sound.play("bouteillev3", {volume: 0.35});
                this.bouteilleC = this.chargeur.getResult("bouteilleC");
                this.bouteilleC.muted = true;
                this.bouteilleCVideo = new createjs.Bitmap(this.bouteilleC);
                this.stage.addChild(this.bouteilleCVideo);
                this.bouteilleC.play();
                this.hotspot2.x = -10;
                this.hotspot2.y = -10;


                if (this.salut === 0) {
                    this.salut++;
                    this.bouteilleC.addEventListener("ended", this.oxo.bind(this))
                }


            }

            if (ndgmr.checkRectCollision(this.cible, this.hotspot4)) {
                console.log("bruh")
                this.gagner();
                clearTimeout(this.tbk);
                clearTimeout(this.tbk2);
                clearTimeout(this.tbk3);
                clearTimeout(this.tbk4);
                clearTimeout(this.tbk5);
                clearTimeout(this.tbk6);

            }

                //  if (ndgmr.checkRectCollision(this.cible, this.hotspot3000)) {
                //      console.log("balleperdue")
//
                //      if (this.salut === 0) {
                //          createjs.Sound.play("bouteillev3", {volume: 0.35});
                //          this.balleperdueV = this.chargeur.getResult("balleperdue");
                //          this.balleperdueV.muted = true;
                //          this.balleperdueVideo = new createjs.Bitmap(this.balleperdueV);
                //          this.stage.addChild(this.balleperdueVideo);
                //          this.balleperdueV.play();
                //      }
//
//
                //  }

                // if (ndgmr.checkRectCollision(this.cible, this.hotspot6)) {
                //     console.log("bruh")
                //     this.gagner2();
                //     clearTimeout(this.tbk2);
                //     clearTimeout(this.tbk);
            // }


            else {
                console.log("it's alright")

            }

            // else if(ndgmr.checkRectCollision(this.cible, this.hotspot4)){
            //
            //     this.bouteilleR = this.chargeur.getResult("bouteilleR");
            //
            //     this.bouteilleR.muted = true;
            //     this.bouteilleRVideo = new createjs.Bitmap(this.bouteilleR);
            //     this.stage.addChild(this.bouteilleRVideo);
            //     this.bouteilleR.play();
            // }
        }

    }

    xoo() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        this.salut++;
        this.bouteilleC = this.chargeur.getResult("bouteilleC");
        this.bouteilleD = this.chargeur.getResult("bouteilleG");


        let xoo = this.chargeur.getResult("xoo");
        xoo.muted = true;
        let xooVideo = new createjs.Bitmap(xoo);
        this.stage.addChild(xooVideo);
        xoo.play();


        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 950;
        this.cible.y = 500;
        this.cible.scale = 0.15;
        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });

        this.bouteilleC.addEventListener("ended", this.xxo.bind(this))
        this.bouteilleD.addEventListener("ended", this.xox.bind(this))

    }


    oox() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        this.salut++;
        this.bouteilleC = this.chargeur.getResult("bouteilleC");
        this.bouteilleG = this.chargeur.getResult("bouteilleD");


        let oox = this.chargeur.getResult("oox");
        oox.muted = true;
        let ooxVideo = new createjs.Bitmap(oox);
        this.stage.addChild(ooxVideo);
        oox.play();


        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;
        //document.body.style.cursor = "ressources/images/target.png";

        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });
        this.bouteilleC.addEventListener("ended", this.oxx.bind(this))
        this.bouteilleG.addEventListener("ended", this.xox.bind(this))

    }


    oxx() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        this.salut++;
        this.bouteilleG = this.chargeur.getResult("bouteilleD");

        let oxx = this.chargeur.getResult("oxx");
        oxx.muted = true;
        let oxxVideo = new createjs.Bitmap(oxx);
        this.stage.addChild(oxxVideo);
        oxx.play();

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;

        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });
        this.bouteilleG.addEventListener("ended", this.xxx.bind(this))
    }

    oxo() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        this.salut++;
        this.bouteilleG = this.chargeur.getResult("bouteilleD");
        this.bouteilleD = this.chargeur.getResult("bouteilleG");

        let oxo = this.chargeur.getResult("oxo");
        oxo.muted = true;
        let oxoVideo = new createjs.Bitmap(oxo);
        this.stage.addChild(oxoVideo);
        oxo.play();


        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;

        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });
        this.bouteilleD.addEventListener("ended", this.oxx.bind(this))
        this.bouteilleG.addEventListener("ended", this.xxo.bind(this))
    }


    xxo() {
        createjs.Sound.play("virevoltant", {volume: 1});
        this.salut++;
        this.bouteilleD = this.chargeur.getResult("bouteilleG");

        let xxo = this.chargeur.getResult("xxo");
        xxo.muted = true;
        let xxoVideo = new createjs.Bitmap(xxo);
        this.stage.addChild(xxoVideo);
        xxo.play();

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;

        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });
        this.bouteilleD.addEventListener("ended", this.xxx.bind(this))
    }

    xox() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        this.salut++;
        this.bouteilleC = this.chargeur.getResult("bouteilleC");

        let xox = this.chargeur.getResult("xox");
        xox.muted = true;
        let xoxVideo = new createjs.Bitmap(xox);
        this.stage.addChild(xoxVideo);
        xox.play();

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;

        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });
        this.bouteilleC.addEventListener("ended", this.xxx.bind(this))


    }

    xxx() {
        this.autorisertirer--;
        createjs.Sound.play("tirez", {volume: 0.50});
        createjs.Sound.play("virevoltant", {volume: 1});
        this.xxx = this.chargeur.getResult("xxx");
        this.xxx.muted = true;
        this.xxxVideo = new createjs.Bitmap(this.xxx);
        this.stage.addChild(this.xxxVideo);
        this.xxx.play();
        this.xxx.addEventListener("ended", this.esquive.bind(this));

    }

    //   balleperdue() {
    //       this.autorisertirer = 0;
    //       console.log("balleperdue")
    //       this.balleperdue = this.chargeur.getResult("balleperdue");
    //       this.balleperdueVideo = new createjs.Bitmap(this.balleperdue);
    //       this.stage.addChild(this.balleperdueVideo);
    //       this.balleperdue.play();
    //       this.balleperdue.addEventListener("ended", this.balleperdue2.bind(this))
//
    //   }
//
    //   balleperdue2() {
    //       this.stage.removeChild(this.balleperdueVideo);
    //   }

    esquivepause() {
        this.socket.on("esquive", message => {
            this.esquiver(message)
        });

        console.log('GOGOGO')
        this.tbk = setTimeout(() => {
            this.esquiveR();
        }, 5000);

    }

    esquive() {
        this.autorisertirer--;
        this.hotspot1.x = -10;
        this.hotspot2.x = -10;
        this.hotspot3.x = -10;

        this.hotspot1.y = -10;
        this.hotspot2.y = -10;
        this.hotspot3.y = -10;


        //   this.socket.on("esquiveGauche", message => {
        //       this.esquiveGauche(message)
        //   });
//
        //   this.socket.on("esquiveDroite", message => {
        //       this.esquiveDroite(message)
        //   });

        this.salut2++;
        let esquiveI = this.chargeur.getResult("esquiveI");
        esquiveI.muted = true;
        let esquiveIVideo = new createjs.Bitmap(esquiveI);
        this.stage.addChild(esquiveIVideo);
        esquiveI.play();
        // Mettre un texte

        this.tbk = setTimeout(() => {
            createjs.Sound.play("decompte", {volume: 0.30});
            this.instruc2 = new createjs.Bitmap(this.chargeur.getResult("instruc2"));
            this.stage.addChild(this.instruc2);
            this.instruc2.x = 0;
            this.instruc2.y = 0;
            this.esquivepause()
        }, 8000);

    }

    esquiver() {
        console.log(this.salut2);
        createjs.Sound.play("esquiver", {volume: 5});
        console.log('EsquiveGauche')
        if (this.salut2 === 1) {
            this.salut2++;
            let esquiveGauche = this.chargeur.getResult("esquiveG");
            esquiveGauche.muted = true;
            let esquiveGaucheVideo = new createjs.Bitmap(esquiveGauche);
            this.stage.addChild(esquiveGaucheVideo);
            esquiveGauche.play();
            clearTimeout(this.tbk);
            esquiveGauche.addEventListener("ended", this.scene1.bind(this));
            createjs.Sound.play("tirez", {volume: 0.20});
        }

    }

    esquiveR() {
        if (this.salut2 === 1) {
            this.salut2++;
            createjs.Sound.play("impact", {volume: 1});
            createjs.Sound.play("bouteillev3", {volume: 0.50});
            createjs.Sound.play("tombe", {volume: 0.5});
            let esquiveR = this.chargeur.getResult("esquiveR");
            esquiveR.muted = true;
            let esquiveRVideo = new createjs.Bitmap(esquiveR);
            this.stage.addChild(esquiveRVideo);
            esquiveR.play();
            clearTimeout(this.tbk);
            esquiveR.addEventListener("ended", this.scene1.bind(this));
        }
    }

    //  esquiveGauche() {
    //      createjs.Sound.play("tombe", {volume: 0.5});
    //      console.log('EsquiveGauche')
    //      if (this.salut2 === 1) {
    //          this.salut2++;
    //          let esquiveGauche = this.chargeur.getResult("esquiveG");
    //          esquiveGauche.muted = true;
    //          let esquiveGaucheVideo = new createjs.Bitmap(esquiveGauche);
    //          this.stage.addChild(esquiveGaucheVideo);
    //          esquiveGauche.play();
    //          clearTimeout(this.tbk);
    //          esquiveGauche.addEventListener("ended", this.scene1.bind(this));
    //      }
    //  }
//
//
    //  esquiveDroite() {
    //      createjs.Sound.play("tombe", {volume: 0.5});
    //      console.log('EsquiveDroite')
    //      if (this.salut2 === 1) {
    //          this.salut2++;
    //          let esquiveDroite = this.chargeur.getResult("esquiveD");
    //          esquiveDroite.muted = true;
    //          let esquiveDroiteVideo = new createjs.Bitmap(esquiveDroite);
    //          this.stage.addChild(esquiveDroiteVideo);
    //          esquiveDroite.play();
    //          clearTimeout(this.tbk);
    //          esquiveDroite.addEventListener("ended", this.scene1.bind(this));
    //      }
    //  }

    scene1() {
        let scene1 = this.chargeur.getResult("scene1");
        let scene1Video = new createjs.Bitmap(scene1);
        this.stage.addChild(scene1Video);
        scene1.play();
        clearTimeout(this.tbk);
        scene1.addEventListener("ended", this.scene2.bind(this));
    }

    scene2() {
        createjs.Sound.play("scene2son", {volume: 0.20});
        let scene2 = this.chargeur.getResult("scene2");
        let scene2Video = new createjs.Bitmap(scene2);
        this.stage.addChild(scene2Video);
        scene2.play();
        scene2.addEventListener("ended", this.scene3.bind(this));
    }

    scene3() {
        createjs.Sound.play("Introduelson", {volume: 0.20});
        let scene3 = this.chargeur.getResult("scene3");
        let scene3Video = new createjs.Bitmap(scene3);
        this.stage.addChild(scene3Video);
        scene3.play();
        scene3.addEventListener("ended", this.idleDuel.bind(this));
    }

    //  introDuel() {
    //      createjs.Sound.stop();
    //      createjs.Sound.play("buildup", {volume: 0.5});
    //      console.log('IntroDuel');
//
    //      let IntroDuel = this.chargeur.getResult("introDuel2");
    //      IntroDuel.muted = true;
    //      let IntroDuelVideo = new createjs.Bitmap(IntroDuel);
    //      this.stage.addChild(IntroDuelVideo);
    //      IntroDuel.play();
    //      clearTimeout(this.tbk);
    //      IntroDuel.addEventListener("ended", this.idleDuel.bind(this));
    //  }
//
//
    //  fight() {
    //      let scenecombat = this.chargeur.getResult("fight1");
    //      scenecombat.muted = true;
    //      let scenecombatvideo = new createjs.Bitmap(scenecombat);
    //      this.stage.addChild(scenecombatvideo);
    //      scenecombat.play();
    //      clearTimeout(this.tbk);
    //      scenecombat.addEventListener("ended", this.idleDuel.bind(this));
//
    //      this.instruc3 = new createjs.Bitmap(this.chargeur.getResult("instruc3"));
    //      this.stage.addChild(this.instruc3);
    //      this.instruc3.x = 0;
    //      this.instruc3.y = 0;
//
    //  }
//
//
    //  fight2() {
    //      let scenecombat2 = this.chargeur.getResult("fight2");
    //      scenecombat2.muted = true;
//
    //      let scenecombatvideo2 = new createjs.Bitmap(scenecombat2);
    //      this.stage.addChild(scenecombatvideo2);
    //      scenecombat2.play();
    //      clearTimeout(this.tbk);
    //      scenecombat2.addEventListener("ended", this.perdu.bind(this));
    //  }


    idleDuel() {
        this.autorisertirer = 0;
        this.salut2 = 2;
        createjs.Sound.stop();
        createjs.Sound.play("buildup", {volume: 0.5});
        console.log('IntroDuel');

        let idleDuel = this.chargeur.getResult("idleDuel2");
        idleDuel.loop = true;
        idleDuel.muted = true;
        let idleDuelVideo = new createjs.Bitmap(idleDuel);
        this.stage.addChild(idleDuelVideo);
        idleDuel.play();
        clearTimeout(this.tbk);

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 950;
        this.cible.y = 500;
        this.cible.scale = 0.15;
        this.cible.addEventListener('pressmove', e => {

            console.log('pressmove');
            this.cible.x = e.stageX;
            this.cible.y = e.stageY;

        });


//////////////////////////////////////////////À VOS MARQUES///////////////////////////////////////////////////

        this.tbk5 = setTimeout(() => {
            this.marques = new createjs.Bitmap(this.chargeur.getResult("marques"));
            this.stage.addChild(this.marques);
            this.marques.x = 590;
            this.marques.y = 0;
            createjs.Sound.play("decompte", {volume: 0.30});
        }, 5000);

//////////////////////////////////////////////PRÊTS///////////////////////////////////////////////////

        this.tbk6 = setTimeout(() => {

            this.prets = new createjs.Bitmap(this.chargeur.getResult("prets"));
            this.stage.addChild(this.prets);
            this.prets.x = 590;
            this.prets.y = 0;


            createjs.Sound.play("decompte", {volume: 0.30});
        }, 10000);


//////////////////////////////////////////////TIREZ///////////////////////////////////////////////////


        this.tbk = setTimeout(() => {
            createjs.Sound.play("tirez", {volume: 1});
            this.autorisertirer=1;
            this.salut2 = 3;
            this.socket.on("esquive", message => {
                this.esquiverduel(message)
            });

            let showdown = this.chargeur.getResult("showdown");
            showdown.loop = false;
            showdown.muted = true;
            let showdownVideo = new createjs.Bitmap(showdown);
            this.stage.addChild(showdownVideo);
            showdown.play();

            this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
            this.stage.addChild(this.cible);
            this.cible.x = 950;
            this.cible.y = 500;
            this.cible.scale = 0.15;
            this.cible.addEventListener('pressmove', e => {

                console.log('pressmove');
                this.cible.x = e.stageX;
                this.cible.y = e.stageY;

            });

            this.partez = new createjs.Bitmap(this.chargeur.getResult("partez"));
            this.stage.addChild(this.partez);
            this.partez.x = 590;
            this.partez.y = 0;

            this.hotspot4 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
            this.stage.addChild(this.hotspot4);
            this.hotspot4.x = 860;
            this.hotspot4.y = 350;
            this.hotspot4.scale = 1.7;
            this.hotspot4.alpha = 0.0001;

            this.tbk2 = setTimeout(() => {
                console.log("gameover")
                this.perdu();
            }, Math.floor(Math.random() * (2000 + 500) + 500))
        }, Math.floor(Math.random() * (10000 + 11000) + 11000));

    }

//////////////////////////////////////////////ESQUIVEZ DUEL///////////////////////////////////////////////////

    esquiverduel() {
        if (this.salut2 === 3) {
            createjs.Sound.play("gunshot2", {volume: 1});
            createjs.Sound.play("balleSiflement", {volume: 0.60});
            this.hotspot4.x = -10;
            this.hotspot4.y = -10;
            clearTimeout(this.tbk);
            clearTimeout(this.tbk2);
            console.log("YIKKKKES!!!");
            let DuelEsquive = this.chargeur.getResult("DuelEsquive2");
            let DuelEsquiveVideo = new createjs.Bitmap(DuelEsquive);
            this.stage.addChild(DuelEsquiveVideo);
            DuelEsquive.play();
            DuelEsquive.addEventListener("ended", this.idleDuel.bind(this));

        }
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

    perdu() {
        this.salut2 = 0;
        createjs.Sound.stop();
        // this.socket.disconnect("tirer", message => {
        //     this.tirer(message)
        // });

        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        createjs.Sound.play("impact", {volume: 1});
        createjs.Sound.play("gunshot2", {volume: 1});

        let youredead = this.chargeur.getResult("perdu2");
        youredead.loop = false;
        youredead.muted = true;
        let youredeadvideo = new createjs.Bitmap(youredead);
        this.stage.addChild(youredeadvideo);
        youredead.play();

        clearTimeout(this.tbk4);
        this.tbk4 = setTimeout(() => {
            this.finperdu();
        }, 5000);
    }


    gagner() {
        this.salut2 = 0;
        createjs.Sound.stop();
        // this.socket.disconnect("tirer", message => {
        //     this.tirer(message)
        // });
        createjs.Sound.play("gunshot", {volume: 1});
        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        createjs.Sound.play("tombe", {volume: 0.5});
        createjs.Sound.play("impact", {volume: 1});


        let youwin22 = this.chargeur.getResult("gagner240");
        youwin22.loop = false;
        youwin22.muted = true;
        let youwinvideo22 = new createjs.Bitmap(youwin22);
        this.stage.addChild(youwinvideo22);
        youwin22.play();
        youwin22.addEventListener("ended", this.gagner2.bind(this));
    }


    gagner2() {
        //  createjs.Sound.play("oiseau", {volume: 0.75});
        //  createjs.Sound.play("virevoltant", {volume: 1});
        //  createjs.Sound.play("tombe", {volume: 0.5});
        //  createjs.Sound.play("impact", {volume: 1});

        let youwin2 = this.chargeur.getResult("gagner22");
        youwin2.loop = false;
        youwin2.muted = true;
        let youwinvideo2 = new createjs.Bitmap(youwin2);
        this.stage.addChild(youwinvideo2);
        youwin2.play();
        clearTimeout(this.tbk);
        youwin2.addEventListener("ended", this.fingagner.bind(this));
    }

    fingagner() {
        this.autorisertirer = 0;
        this.hotspot4.x = -10;
        this.hotspot4.y = -10;
        createjs.Sound.play("victoire", {volume: 0.15});
        //   this.stage.removeChild(this.hotspot1);
        //   this.stage.removeChild(this.hotspot2);
        //   this.stage.removeChild(this.hotspot3);
        //   this.stage.removeChild(this.hotspot4);
        //   this.stage.removeChild(this.cible);

        //Temporaire fuck up les bouteilles btw et l'esquive (Rend le jeux cursed lol)
        this.hotspot4.scale = 0;
        //////////////////////////////////////
        // this.stage.removeAllChildren();


        this.tbk4 = setTimeout(() => {
            this.victoire1 = new createjs.Bitmap(this.chargeur.getResult("victoire2"));
            this.stage.addChild(this.victoire1);
            this.victoire1.x = 500;
            this.victoire1.y = 200;
            this.newgagner();
        }, 200);
    }

    finperdu() {
        this.autorisertirer = 0;
        this.hotspot4.x = -10;
        this.hotspot4.y = -10;
        createjs.Sound.play("defaite", {volume: 0.15});

        //Temporaire fuck up les bouteilles btw et l'esquive (Rend le jeux cursed lol)
        this.hotspot4.scale = 0;
        //////////////////////////////////////
        //this.stage.removeAllChildren();

        this.tbk4 = setTimeout(() => {
            this.defaite1 = new createjs.Bitmap(this.chargeur.getResult("defaite2"));
            this.stage.addChild(this.defaite1);
            this.defaite1.x = 500;
            this.defaite1.y = 200;
            this.newperdu();
        }, 200);
    }

    newgagner() {
        console.log("recommecethatgame")
        this.socket.emit("recommencer")

        // this.tbk4 = setTimeout(() => {
        //     this.socket.emit("recommencer")
        //     //window.location.reload()
        // }, 14000);
    }

    newperdu() {
        console.log("recommecethatgame2")
        this.socket.emit("recommencer2")

        // this.tbk4 = setTimeout(() => {
        //     this.socket.emit("recommencer")
        //     //window.location.reload()
        // }, 14000);
    }


    //  fincommande() {
    //      this.io.off("connection", socket => {
//
    //          // On garde une référence au client dans un tableau de tous les clients
    //          this.clients.push(socket);
//
//
    //          // Ajout d'écouteurs sur les événements "position" (tactile) et "mouvement' (device orientation)
    //          socket.off("position", this.deplacer.bind(this));
    //          //socket.on("position", console.log("Lopl"));
    //          socket.off("go", this.commencer.bind(this));
    //          socket.off("tirer", this.tirer.bind(this));
    //         //socket.off("esquiveDroite", this.esquiveDroite.bind(this));
    //         //socket.off("esquiveGauche", this.esquiveGauche.bind(this));
    //          socket.off("mouvement", this.bouger.bind(this));
//
    //          // Lors d'une déconnexion du client
    //          socket.on('disconnect', () => {
    //              console.log(`Déconnexion d'un client / ${this.clients.length} client(s) restant(s)`);
    //              this.clients = this.clients.filter(item => item !== socket)
    //          });
//
    //      });
    //  }

}
