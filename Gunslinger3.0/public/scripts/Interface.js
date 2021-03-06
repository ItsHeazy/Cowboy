export class Interface {

    constructor() {

        // Redirection vers la version sécurisée (ceci est exigée par l'API de mouvement et
        // d'orientation)
        this.socket = io("http://192.168.0.199:3000");


        document.querySelector(".zone").addEventListener("touchmove", this.gererMouvement.bind(this));

        document.querySelector(".btn-p2-p1").addEventListener("touchstart", this.esquiveGauche.bind(this));


        document.querySelector(".btn-p2-p2").addEventListener("touchstart", this.esquiveDroite.bind(this));

        //When "tirer" button is clicked
        document.querySelector(".btn-p2-p3").addEventListener("touchstart", this.tirer.bind(this));





    }

    esquiveGauche(e) {
        console.log('mere')
        this.socket.emit('esquiveGauche');

    }

    tirer(e) {
        console.log('tirer31312')
        this.socket.emit('tirer');

    }


    esquiveDroite(e) {
        console.log('ta')
        this.socket.emit('esquiveDroite');

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
