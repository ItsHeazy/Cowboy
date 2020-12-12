export class Jeu {

    constructor() {

        let codedonner = Math.floor(Math.random() * 200);

        console.log(codedonner);

        // Instanciation du client Socket.IO pour communiquer avec le serveur
        this.socket = io("https://cgilles.dectim.ca:3005", {
            query: {type: 'jeu', codeJeu: codedonner} // identification en tant que jeu
        });

        this.socket.on("commencer", message => {
            this.commencer(message)
        });

        this.socket.on("position", message => {
            this.deplacer(message)
        });



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


        this.canvas = document.querySelector("canvas");
        this
            .precharger("ressources/manifest.json")
            .then(this.initialiserCreateJS.bind(this))
            .catch(erreur => console.error(erreur));

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
    }


    commencer() {

        this.socket.on("mouvement", message => {
            this.bouger(message);
        });

        createjs.Sound.stop();
        this.musique = createjs.Sound.play('ambiance', {loop: -1, volume: 0.1});
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

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;

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


    debutTraining() {
        this.debut = this.chargeur.getResult("start");
        //baliseVideo.loop = true; // optionnel: pour jouer en boucle
        this.debut.muted = true;
        this.debutVideo = new createjs.Bitmap(this.debut);
        this.stage.addChild(this.debutVideo);
        this.debut.play();

    }


    idle() {

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

        this.regle1 = new createjs.Bitmap(this.chargeur.getResult("regle1"));
        this.stage.addChild(this.regle1);
        this.regle1.x = 590;
        this.regle1.y = 5;

        this.cible = new createjs.Bitmap(this.chargeur.getResult("target"));
        this.stage.addChild(this.cible);
        this.cible.x = 1000;
        this.cible.y = 800;
        this.cible.scale = 0.15;
        this.cursor = this.cible;

        this.hotspot1 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot1);
        this.hotspot1.x = 793;
        this.hotspot1.y = 395;
        this.hotspot1.scale = 0.75;
        this.hotspot1.alpha = 0.000000000001;


        this.hotspot2 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot2);
        this.hotspot2.x = 1000;
        this.hotspot2.y = 310;
        this.hotspot2.scale = 0.75;
        this.hotspot2.alpha = 0.000000000001;


        this.hotspot3 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot3);
        this.hotspot3.x = 1095;
        this.hotspot3.y = 590;
        this.hotspot3.scale = 0.85;
        this.hotspot3.alpha = 0.000000000001;

        // this.hotspot4 = new createjs.Bitmap(this.chargeur.getResult('hotspotR'));
        // this.stage.addChild(this.hotspot4);
        // this.hotspot4.x = 0;
        // this.hotspot4.y = 0;
        // this.hotspot4.alpha = 0.50;

    }

    bouger(message) {


        //console.log(message.alpha, message.beta);
        this.cible.x = ((message.alpha - 1) / 180 * window.innerWidth);
        //this.cible.y = (message.beta * window.innerHeight);

        //message.alpha * Math.PI / 180

        let alphax = message.alpha,
            betay = message.beta
        // gammaz = message.gamma;

        //  if (alpha <= -90) {
        //      this.cible.y = 760
//
        //  }
        //  if (alpha >= 45) {
        //      this.cible.y = 0
        //  }
//
        //  if (alpha >= -90 && alpha <= 45) {
        //      this.cible.y = (-(alpha) + 45) / 100 * this.canvas.height;
        //  }
//

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

    deplacer(message) {
        console.log("jebouge");

        this.cible.x = message.x
        this.cible.y = message.y

        this.cible.y = (message.ratioY * window.innerHeight) * 2;
        this.cible.x = (message.ratioX * window.innerHeight) * 2;
    }


    tirer() {
        console.log('tirer');
        console.log(this.salut);
        createjs.Sound.play("gunshot", {volume: 0.35});
        if (ndgmr.checkRectCollision(this.cible, this.hotspot3)) {
            createjs.Sound.play("bouteillev1", {volume: 0.35});
            console.log('cursd4erd');

            this.bouteilleD = this.chargeur.getResult("bouteilleG");
            this.bouteilleD.muted = true;
            this.bouteilleDVideo = new createjs.Bitmap(this.bouteilleD);
            this.stage.addChild(this.bouteilleDVideo);
            this.bouteilleD.play();

            if (this.salut === 0) {
                this.salut++;
                this.bouteilleD.addEventListener("ended", this.oox.bind(this))
            }


        }
        if (ndgmr.checkRectCollision(this.cible, this.hotspot1)) {
            createjs.Sound.play("bouteillev2", {volume: 0.35});
            this.bouteilleG = this.chargeur.getResult("bouteilleD");
            this.bouteilleG.muted = true;
            this.bouteilleGVideo = new createjs.Bitmap(this.bouteilleG);
            this.stage.addChild(this.bouteilleGVideo);
            this.bouteilleG.play();

            if (this.salut === 0) {
                this.salut++;
                this.bouteilleG.addEventListener("ended", this.xoo.bind(this))
            }


        }
        if (ndgmr.checkRectCollision(this.cible, this.hotspot2)) {
            createjs.Sound.play("bouteillev3", {volume: 0.35});
            this.bouteilleC = this.chargeur.getResult("bouteilleC");
            this.bouteilleC.muted = true;
            this.bouteilleCVideo = new createjs.Bitmap(this.bouteilleC);
            this.stage.addChild(this.bouteilleCVideo);
            this.bouteilleC.play();

            if (this.salut === 0) {
                this.salut++;
                this.bouteilleC.addEventListener("ended", this.oxo.bind(this))
            }


        }

        if (ndgmr.checkRectCollision(this.cible, this.hotspot4)) {
            console.log("bruh")
            this.gagner();
            clearTimeout(this.tbk2);
            clearTimeout(this.tbk);
        } else {
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
        createjs.Sound.play("virevoltant", {volume: 1});
        this.xxx = this.chargeur.getResult("xxx");
        this.xxx.muted = true;
        this.xxxVideo = new createjs.Bitmap(this.xxx);
        this.stage.addChild(this.xxxVideo);
        this.xxx.play();
        this.xxx.addEventListener("ended", this.esquive.bind(this));

    }

    esquivepause() {
        console.log('GOGOGO')
        this.esquiveR();

    }


    esquive() {

        this.socket.on("esquiveGauche", message => {
            this.esquiveGauche(message)
        });

        this.socket.on("esquiveDroite", message => {
            this.esquiveDroite(message)
        });

        this.salut2++;
        let esquiveI = this.chargeur.getResult("esquiveI");
        esquiveI.muted = true;
        let esquiveIVideo = new createjs.Bitmap(esquiveI);
        this.stage.addChild(esquiveIVideo);
        esquiveI.play();
        // Mettre un texte
        this.tbk = setTimeout(() => {
            this.esquivepause()
        }, 12000);

        this.instruc2 = new createjs.Bitmap(this.chargeur.getResult("instruc2"));
        this.stage.addChild(this.instruc2);
        this.instruc2.x = window/2;
        this.instruc2.y = window/2;

    }

    esquiveR() {
        createjs.Sound.play("impact", {volume: 1});
        createjs.Sound.play("bouteillev3", {volume: 1});
        createjs.Sound.play("tombe", {volume: 0.5});
        let esquiveR = this.chargeur.getResult("esquiveR");
        esquiveR.muted = true;
        let esquiveRVideo = new createjs.Bitmap(esquiveR);
        this.stage.addChild(esquiveRVideo);
        esquiveR.play();
        clearTimeout(this.tbk);
        esquiveR.addEventListener("ended", this.introDuel.bind(this));
    }

    esquiveGauche() {
        createjs.Sound.play("tombe", {volume: 0.5});
        console.log('EsquiveGauche')
        if (this.salut2 === 1) {
            this.salut2++;
            let esquiveGauche = this.chargeur.getResult("esquiveG");
            esquiveGauche.muted = true;
            let esquiveGaucheVideo = new createjs.Bitmap(esquiveGauche);
            this.stage.addChild(esquiveGaucheVideo);
            esquiveGauche.play();
            clearTimeout(this.tbk);
            esquiveGauche.addEventListener("ended", this.introDuel.bind(this));
        }
    }


    esquiveDroite() {
        createjs.Sound.play("tombe", {volume: 0.5});
        console.log('EsquiveDroite')
        if (this.salut2 === 1) {
            this.salut2++;
            let esquiveDroite = this.chargeur.getResult("esquiveD");
            esquiveDroite.muted = true;
            let esquiveDroiteVideo = new createjs.Bitmap(esquiveDroite);
            this.stage.addChild(esquiveDroiteVideo);
            esquiveDroite.play();
            clearTimeout(this.tbk);
            esquiveDroite.addEventListener("ended", this.introDuel.bind(this));
        }
    }


    introDuel() {
        createjs.Sound.stop();
        createjs.Sound.play("buildup", {volume: 0.5});
        console.log('IntroDuel')
        let IntroDuel = this.chargeur.getResult("introDuel");
        IntroDuel.muted = true;
        let IntroDuelVideo = new createjs.Bitmap(IntroDuel);
        this.stage.addChild(IntroDuelVideo);
        IntroDuel.play();
        clearTimeout(this.tbk);
        IntroDuel.addEventListener("ended", this.fight.bind(this));
    }


    fight() {
        let scenecombat = this.chargeur.getResult("fight1");
        scenecombat.muted = true;
        let scenecombatvideo = new createjs.Bitmap(scenecombat);
        this.stage.addChild(scenecombatvideo);
        scenecombat.play();
        clearTimeout(this.tbk);
        scenecombat.addEventListener("ended", this.idleDuel.bind(this));
    }


    fight2() {
        let scenecombat2 = this.chargeur.getResult("fight2");
        scenecombat2.muted = true;

        let scenecombatvideo2 = new createjs.Bitmap(scenecombat2);
        this.stage.addChild(scenecombatvideo2);
        scenecombat2.play();
        clearTimeout(this.tbk);
        scenecombat2.addEventListener("ended", this.perdu.bind(this));
    }


    idleDuel() {

        this.stage.removeChild(this.hotspot1);
        this.stage.removeChild(this.hotspot2);
        this.stage.removeChild(this.hotspot3);

        let idleDuel = this.chargeur.getResult("idleDuel");
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

        this.tbk5 = setTimeout(() => {
            createjs.Sound.play("decompte", {volume: 1});
        }, 5000);

        this.tbk6 = setTimeout(() => {
            createjs.Sound.play("decompte", {volume: 1});
        }, 10000);


        this.tbk = setTimeout(() => {
            createjs.Sound.play("tirez", {volume: 1});

            this.hotspot4 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
            this.stage.addChild(this.hotspot4);
            this.hotspot4.x = 905;
            this.hotspot4.y = 250;
            this.hotspot4.scale = 4;
            this.hotspot4.alpha = 0.001;

            this.tbk2 = setTimeout(() => {
                console.log("gameover")
                this.stage.removeChild(this.hotspot1);
                this.stage.removeChild(this.hotspot2);
                this.stage.removeChild(this.hotspot3);
                this.stage.removeChild(this.hotspot4);
                this.perdu();
            }, 2000);
        }, 13000);

    }


    perdu() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        createjs.Sound.play("impact", {volume: 1});
        createjs.Sound.play("gunshot2", {volume: 1});
        let youredead = this.chargeur.getResult("perdu");
        youredead.loop = false;
        youredead.muted = true;
        let youredeadvideo = new createjs.Bitmap(youredead);
        this.stage.addChild(youredeadvideo);
        youredead.play();
        clearTimeout(this.tbk2);
        this.tbk4 = setTimeout(() => {
            this.finperdu();
        }, 5000);
    }


    gagner() {
        createjs.Sound.play("oiseau", {volume: 0.75});
        createjs.Sound.play("virevoltant", {volume: 1});
        createjs.Sound.play("tombe", {volume: 0.5});
        clearTimeout(this.tbk5);
        createjs.Sound.play("impact", {volume: 1});
        let youwin = this.chargeur.getResult("gagner");
        youwin.loop = false;
        youwin.muted = true;
        let youwinvideo = new createjs.Bitmap(youwin);
        this.stage.addChild(youwinvideo);
        youwin.play();
        clearTimeout(this.tbk);
        this.tbk4 = setTimeout(() => {
            this.fingagner();
        }, 5000);
    }

    fingagner() {
        createjs.Sound.play("victoire", {volume: 0.35});
        this.stage.removeChild(this.hotspot1);
        this.stage.removeChild(this.hotspot2);
        this.stage.removeChild(this.hotspot3);
        this.stage.removeChild(this.hotspot4);
        this.stage.removeChild(this.cible);
        //Temporaire fuck up les bouteilles btw et l'esquive (Rend le jeux cursed lol)
        this.hotspot4.scale = 0;
        //////////////////////////////////////
        document.querySelector("canvas").style.display = "none"
        this.stage.removeAllChildren();
        //this.fincommande()

    }


    finperdu() {
        createjs.Sound.play("defaite", {volume: 0.35});
        this.stage.removeChild(this.hotspot1);
        this.stage.removeChild(this.hotspot2);
        this.stage.removeChild(this.hotspot3);
        this.stage.removeChild(this.hotspot4);
        this.stage.removeChild(this.cible);
        //Temporaire fuck up les bouteilles btw et l'esquive (Rend le jeux cursed lol)
        this.hotspot4.scale = 0;
        //////////////////////////////////////
        this.stage.removeAllChildren();
        document.querySelector("canvas").style.display = "none"
        //this.fincommande()
    }

    new() {
        window.location.reload()
    }


    fincommande() {
        this.io.off("connection", socket => {

            // On garde une référence au client dans un tableau de tous les clients
            this.clients.push(socket);


            // Ajout d'écouteurs sur les événements "position" (tactile) et "mouvement' (device orientation)
            socket.off("position", this.deplacer.bind(this));
            //socket.on("position", console.log("Lopl"));
            socket.off("go", this.commencer.bind(this));
            socket.off("tirer", this.tirer.bind(this));
            socket.off("esquiveDroite", this.esquiveDroite.bind(this));
            socket.off("esquiveGauche", this.esquiveGauche.bind(this));
            socket.off("mouvement", this.bouger.bind(this));

            // Lors d'une déconnexion du client
            socket.on('disconnect', () => {
                console.log(`Déconnexion d'un client / ${this.clients.length} client(s) restant(s)`);
                this.clients = this.clients.filter(item => item !== socket)
            });

        });
    }

}
