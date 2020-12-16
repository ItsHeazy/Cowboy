export class Interface {

    constructor() {
        console.log("Hello World");

        //   document.getElementById("code").addEventListener('keydown', e => {
        //       if (e.keyCode === 13) {
        //           console.log("allo3")
        //           this.initialiser();
        //       }
//
        //   })

        this.verificationJeu();


    }

    verificationJeu() {
        console.log("hey")
        this.codeJeu = document.getElementById("codeJeu");
        this.codeJeuR = document.getElementById("codeJeuR");
        this.codeJeuR.addEventListener('click', (e) => {
            this.confirmationJeu(this.codeJeu.value);
        })
    }

    confirmationJeu(message) {
        this.codeJeuR.remove();
        console.log("patate");
        // Instantiation du client Socket.IO pour communiquer avec le serveur
        this.socket = io("https://cgilles.dectim.ca:3005", {
            //query: {type: "interface", code: document.getElementById("code").value}
            query: {type: "interface", codeJeu: message}
        });


        this.socket.on("mauvaisID", () => {
            return alert('Rafraichissez la page et entrez le bon Code pour jouer au jeu!')

        });

        this.socket.on("recommencer", () => {
            document.querySelector('.game-page').classList.add('u-hidden');
            document.querySelector('.congrats-page').classList.remove('u-hidden');
        });

        this.socket.on("recommencer2", () => {
            document.querySelector('.game-page').classList.add('u-hidden');
            document.querySelector('.congrats-page2').classList.remove('u-hidden');
        });

        // Envoi d'un événement "click" quand le joueur clique sur la page
        document.querySelector(".start-page-btn").addEventListener("click", this.initialiser().bind(this));

        //document.querySelector(".btn-p3").addEventListener("touchstart", this.new().bind(this));
        document.querySelector(".btn-p3").addEventListener("touchstart", this.kellog().bind(this));



    }


    initialiser() {
        this.autoriser()
        //  this.confirmationJeu()
        document.querySelector(".btn-p2-p3").addEventListener("touchstart", e => {
            this.tirer();
        });

        document.querySelector(".touchtire").addEventListener("touchstart", e => {
            this.tirer();
        });


        //  document.querySelector(".btn-p2-p1").addEventListener("touchstart", e => {
        //      this.esquiveGauche();
        //  });
//
        //  document.querySelector(".btn-p2-p2").addEventListener("touchstart", e => {
        //      this.esquiveDroite();
        //  });
//
        document.querySelector(".btn-esquiver").addEventListener("touchstart", e => {
            this.esquive();
        });

        document.querySelector(".touchfat").addEventListener("touchstart", e => {
            this.esquive();
        });

        //  document.querySelector(".btn-p3").addEventListener("touchstart", e => {
        //      this.new.bind();
        //  });

        // Réception des messages "position" et affichage de la position du joueur
        // this.socket.on("position", message => {
        //     // document.getElementById("position").innerText = message.position;
        // });

        //  // Envoi d'un événement "touchmove" quand le joueur touche à la page
        //  document.body.addEventListener("touchmove", e => {
        //    this.socket.emit("touchmove", {type: "touchmove", x: e.touches[0].clientX, y: e.touches[0].clientY});
        //  });

        // document.querySelector(".start-page-btn").addEventListener("touchstart", this.commencer.bind(this));
        // document.querySelector(".start-page-btn").addEventListener("touchstart", this.autoriser.bind(this));

        // document.querySelector(".btn-p2-p1").addEventListener("touchstart", this.esquiveGauche.bind(this));


        // document.querySelector(".btn-p2-p2").addEventListener("touchstart", this.esquiveDroite.bind(this));

        // //When "tirer" button is clicked
        // document.querySelector(".btn-p2-p3").addEventListener("touchstart", this.tirer.bind(this));

        // //A changer quick
        // this.cheese = 0

    }


    commencer() {
        console.log("yo")
        //  document.querySelector(".choix").style.display = "flex"
        document.querySelector('.start-page').classList.add('u-hidden');
        document.querySelector('.game-page').classList.remove('u-hidden');
        this.socket.emit('commencer');

        //     document.querySelector(".gyro").addEventListener("touchstart", this.gyro.bind(this))
        //     document.querySelector(".touch").addEventListener("touchstart", this.touch.bind(this))
    }

    // gyro() {
    //     document.querySelector('.start-page').classList.add('u-hidden');
    //     document.querySelector('.game-page').classList.remove('u-hidden');
    //     this.socket.emit('commencer');
    //     this.autoriser();
    // }

    // touch() {
    //     document.querySelector(".touchpad").addEventListener("touchmove", this.gererMouvement.bind(this));
    //     document.querySelector(".choix").style.display = "none"
    //     document.querySelector('.start-page').classList.add('u-hidden');
    //     document.querySelector('.game-page2').classList.remove('u-hidden');
    //     this.socket.emit('commencer');
    // }

    // fin() {
    //     console.log("fin")
    //     document.querySelector('.game-page').classList.add('u-hidden');
    //     document.querySelector('.congrats-page').classList.remove('u-hidden');

    //     // document.querySelector(".btn-p2-p1").removeEventListener("touchstart", this.esquiveGauche.bind(this));

    //     // document.querySelector(".btn-p2-p2").removeEventListener("touchstart", this.esquiveDroite.bind(this));

    //     document.querySelector(".btn-p2-p3").removeEventListener("touchstart", this.tirer.bind(this));

    //     this.socket.emit('NouvellePartie');
    // }


    esquiveGauche() {
        console.log('G')
        this.socket.emit('esquiveGauche');
    }

    esquiveDroite() {
        console.log('D')
        this.socket.emit('esquiveDroite');
    }

    esquive() {
        console.log('E')
        this.socket.emit('esquive');
    }

    tirer() {
        //  this.cheese++;
        //  console.log(this.cheese)
        this.socket.emit('tirer');

        //Ca recommence le jeux
        //   if (this.cheese === 7) {
        //       this.fin()
        //   }
    }

    new() {
        //window.location.reload();
        //this.socket.emit('recommencerJeu');
        document.querySelector('.congrats-page').classList.add('u-hidden');
        document.querySelector('.congrats-page2').classList.add('u-hidden');
        document.querySelector('.game-page').classList.remove('u-hidden');
        this.socket.emit('recommencerJeu');
    }

    kellog(){
        window.location.reload();
    }
    autoriser(e) {
        // Vérifier si les événements d'orientation sont disponibles sur cette plateforme
        if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
            // alert("Oups! Votre fureteur ne supporte pas la détection d'orientation.");
            window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
            alert("Pointez le devant de votre téléphone vers le centre de l'écran pour profiter pleinement de l'expérience, puis appuyez sur « OK ");
            document.querySelector(".choix").style.display = "none";
            this.commencer();

        } else {

            //Demande de permission à l'usager pour l'utilisation des événements d'orientation
            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') {
                        alert("Pointez le devant de votre téléphone vers le centre de l'écran pour profiter pleinement de l'expérience, puis appuyez sur « OK ");
                        document.querySelector(".choix").style.display = "none";
                        window.addEventListener('deviceorientation', this.gererOrientation.bind(this));
                        this.commencer();
                    } else if (state === 'denied') {
                        alert("Denied!");
                    }
                });
        }


    }

    gererOrientation(e) {
        // this.socket.emit("mouvement", {alpha: e.alpha, beta: e.beta, gamma: e.gamma});
        this.socket.emit("mouvement", {alpha: e.alpha, beta: e.beta});
    }

    gererMouvement(e) {
        // Affichage de l'objet TouchEvent dans la console (attention: cela peut affecter la
        // performance)
        console.log(e);

        let position = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };

        let ratio = {
            x: position.x / window.innerWidth,
            y: position.y / window.innerHeight,
        };

        this.socket.emit(
            "position",
            {
                x: position.x,
                y: position.y,
                ratioX: ratio.x,
                ratioY: ratio.y
            }
        );
    }


}

