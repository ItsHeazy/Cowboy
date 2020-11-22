import {Serveur} from "./Serveur.js";
import {Jeu} from "./Jeu.js";


const express = require("express");
const http = require("http");

export class Application {
    constructor() {

        this.salut = 0;
        this.salut2 = 0;


        nw.Window.get().showDevTools();

        this.app = express();
        this.serveur = http.createServer(this.app);
        this.io = require("socket.io")(this.serveur);
        this.app.use(express.static("public"));


        this.canvas = document.querySelector("canvas");
        this
            .precharger("ressources/manifest.json")
            .then(this.initialiserCreateJS.bind(this))
            .then(this.demarrer.bind(this))
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

    demarrer() {
        this.musique = createjs.Sound.play('ambiance', {loop: -1, volume:0.1});
        this.serveur.listen(3000, "192.168.0.199", () => {
            console.log("Le serveur");
        });

        this.io.on("connection", socket => {
            console.log("Nouveau client", socket);

            socket.on("position", this.deplacer.bind(this));
            socket.on("tirer", this.tirer.bind(this));
            socket.on("esquiveDroite", this.esquiveDroite.bind(this));
            socket.on("esquiveGauche", this.esquiveGauche.bind(this));
        });


        // Quelques notes concernant la vidéo dans Chrome/Chromium vs NW.js
        //
        //   - Dans Chrome/Chromium, il n'est pas possible de démarrer la vidéo automatiquement si le
        //     son est actif. Même si vous mettez l'attribut 'autoplay' et/ou que appelez la méthode
        //     play().
        //
        //   - Par contre, si l'attribute 'muted' est vrai sur la balise, on peut démarrer la vidéo
        //     automatiquement (via l'attribut "autoplay" ou la méthode play()).
        //
        //   - Il est toujours possible de démarrer une vidéo avec du son lorsque c'est en réponse à une
        //     action de l'usager (comme un clic ou un événement clavier).
        //
        //   - Dans NW.js, il n'y a pas ce genre de restriction. On peut donc démarrer automatiquement
        //     une vidéo sans avoir à mettre le son en sourdine. Il suffit de mettre l'attribut
        //     'autoplay' ou d'utiliser la méthode play().
        //
        //   - À ce moment-ci, StageGL ne peut pas être utilisé pour affiche de la vidéo. Vous devez
        //     donc utiliser Stage. Ça ne change rien à votre projet. Vous pouvez aussi utiliser 2
        //     stages (un StageGL et un Stage) un par-dessus l'autre.
        //
        //     Détails à ce sujet: https://github.com/CreateJS/EaselJS/issues/1011


        // Exemple 01 - La vidéo est chargée via le fichier manifest.json et est affichée en utilisant
        // un objet createjs.Bitmap. Il faut utiliser Stage au lieu de StageGL dans votre projet.
        let intro = this.chargeur.getResult("intro");
        //baliseVideo.loop = true; // optionnel: pour jouer en boucle
        intro.muted = true;
        let introVideo = new createjs.Bitmap(intro);
        this.stage.addChild(introVideo);
        intro.play();
        intro.addEventListener("ended", this.debutTraining.bind(this));

        this.titre = new createjs.Bitmap(this.chargeur.getResult("titre"));
        this.stage.addChild(this.titre);
        this.titre.x = 590;
        this.titre.y = 5;
        this.titre.scale = 0.5;

        // Pour arrêter la vidéo, il faut utiliser la méthode pause() et ramener la tête de lecture à 0.
        // Malheureusement, il n'existe pas de méthode stop().
        // baliseVideo.pause();
        // baliseVideo.currentTime = 0; // revient au début


        // Exemple 02 - Si la vidéo joue en boucle et affiche un flash blanc lors du retour au début,
        // utilisez un objet VideoBuffer pour régler le problème. Encore une fois, vous devez utiliser
        // Stage plutôt que StageGL.
        // let balise = document.createElement('video');
        // balise.src = 'ressources/exemple.webm';
        // balise.play();
        // let buffer = new createjs.VideoBuffer(balise);
        // let video = new createjs.Bitmap(buffer);
        // this.stage.addChild(video);

    }

    debutTraining() {
        this.debut = this.chargeur.getResult("start");
        //baliseVideo.loop = true; // optionnel: pour jouer en boucle
        this.debut.muted = true;
        this.debutVideo = new createjs.Bitmap(this.debut);
        this.stage.addChild(this.debutVideo);
        this.debut.play();
        this.debut.addEventListener("ended", this.idle.bind(this))
    }


    idle() {
        let idle = this.chargeur.getResult("idle");
        idle.loop = true; // optionnel: pour jouer en boucle
        idle.muted = true;
        let idleVideo = new createjs.Bitmap(idle);
        this.stage.addChild(idleVideo);
        idle.play();
        idle.addEventListener("ended", this.idle.bind(this));


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

        this.hotspot1 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot1);
        this.hotspot1.x = 580;
        this.hotspot1.y = 700;
        this.hotspot1.scale = 1.6;
        this.hotspot1.alpha = 0.001;


        this.hotspot2 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot2);
        this.hotspot2.x = 725;
        this.hotspot2.y = 330;
        this.hotspot2.scale = 1.6;
        this.hotspot2.alpha = 0.001;


        this.hotspot3 = new createjs.Bitmap(this.chargeur.getResult('hotspot'));
        this.stage.addChild(this.hotspot3);
        this.hotspot3.x = 1075;
        this.hotspot3.y = 150;
        this.hotspot3.scale = 1.6;
        this.hotspot3.alpha = 0.001;

        // this.hotspot4 = new createjs.Bitmap(this.chargeur.getResult('hotspotR'));
        // this.stage.addChild(this.hotspot4);
        // this.hotspot4.x = 0;
        // this.hotspot4.y = 0;
        // this.hotspot4.alpha = 0.50;

    }

    deplacer(message) {

        this.cible.x = message.x;
        this.cible.y = message.y;
        //this.cible.style.top = (message.ratioY * window.innerHeight) + "px";


    }


    tirer() {
        console.log('tirer');
        console.log(this.salut);
        createjs.Sound.play("gunshot",{volume:0.1});
        if (ndgmr.checkRectCollision(this.cible, this.hotspot3)) {
            console.log('cursd4erd');

            this.bouteilleD = this.chargeur.getResult("bouteilleD");
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
            this.bouteilleG = this.chargeur.getResult("bouteilleG");
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
        createjs.Sound.play("impact",{volume:0.1});
        this.salut++;
        this.bouteilleC = this.chargeur.getResult("bouteilleC");
        this.bouteilleD = this.chargeur.getResult("bouteilleD");


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
        createjs.Sound.play("impact",{volume:0.1});
        this.salut++;
        this.bouteilleC = this.chargeur.getResult("bouteilleC");
        this.bouteilleG = this.chargeur.getResult("bouteilleG");


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
        createjs.Sound.play("impact",{volume:0.1});
        this.salut++;
        this.bouteilleG = this.chargeur.getResult("bouteilleG");

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
        createjs.Sound.play("impact",{volume:0.1});
        this.salut++;
        this.bouteilleG = this.chargeur.getResult("bouteilleG");
        this.bouteilleD = this.chargeur.getResult("bouteilleD");

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
        createjs.Sound.play("impact",{volume:0.1});
        this.salut++;
        this.bouteilleD = this.chargeur.getResult("bouteilleD");

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
        createjs.Sound.play("impact",{volume:0.1});
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
        createjs.Sound.play("impact",{volume:0.1});
        this.xxx = this.chargeur.getResult("xxx");
        this.xxx.muted = true;
        this.xxxVideo = new createjs.Bitmap(this.xxx);
        this.stage.addChild(this.xxxVideo);
        this.xxx.play();
        this.xxx.addEventListener("ended", this.esquive.bind(this));

    }

    esquivepause(){
            console.log('GOGOGO')
            this.esquiveR();

    }


    esquive() {
        this.salut2++;
        let esquiveI = this.chargeur.getResult("esquiveI");
        esquiveI.muted = true;
        let esquiveIVideo = new createjs.Bitmap(esquiveI);
        this.stage.addChild(esquiveIVideo);
        esquiveI.play();
// Mettre un texte
        this.tbk = setTimeout(() =>{ this.esquivepause() },15000);


    }

    esquiveR() {

        let esquiveR = this.chargeur.getResult("esquiveR");
        esquiveR.muted = true;
        let esquiveRVideo = new createjs.Bitmap(esquiveR);
        this.stage.addChild(esquiveRVideo);
        esquiveR.play();
    }


    esquiveGauche() {
        console.log('EsquiveGauche')
        if (this.salut2 === 1){
            this.salut2++;
            let esquiveGauche = this.chargeur.getResult("esquiveG");
            esquiveGauche.muted = true;
            let esquiveGaucheVideo = new createjs.Bitmap(esquiveGauche);
            this.stage.addChild(esquiveGaucheVideo);
            esquiveGauche.play();
            clearTimeout(this.tbk);
            esquiveGauche.addEventListener("ended", this.bye.bind(this));
        }
    }


    esquiveDroite() {
        console.log('EsquiveDroite')
             if (this.salut2 === 1) {
                 this.salut2++;
             let esquiveDroite = this.chargeur.getResult("esquiveD");
            esquiveDroite.muted = true;
            let esquiveDroiteVideo = new createjs.Bitmap(esquiveDroite);
            this.stage.addChild(esquiveDroiteVideo);
            esquiveDroite.play();
                 clearTimeout(this.tbk);
                 esquiveDroite.addEventListener("ended", this.bye.bind(this));
        }
    }


    bye(){
        let intro = this.chargeur.getResult("intro");
        //baliseVideo.loop = true; // optionnel: pour jouer en boucle
        intro.muted = true;
        let introVideo = new createjs.Bitmap(intro);
        this.stage.addChild(introVideo);
        //intro.play();
    }

}








