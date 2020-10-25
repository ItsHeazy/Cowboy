export class Jeu{

    constructor() {
        this.canvas = document.querySelector("canvas");
        //this.canvas.width = window.innerWidth;
        //this.canvas.height = window.innerHeight;

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
        let baliseVideo = this.chargeur.getResult("intro");
        //baliseVideo.loop = true; // optionnel: pour jouer en boucle
        baliseVideo.muted = true;
        let bitmapVideo = new createjs.Bitmap(baliseVideo);
        this.stage.addChild(bitmapVideo);
        baliseVideo.play();

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

}


