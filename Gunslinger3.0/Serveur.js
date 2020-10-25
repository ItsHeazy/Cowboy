
const express = require("express")
const http = require("http")

export class Serveur {

    constructor() {

        this.app = express();
        this.serveur = http.createServer(this.app);
        this.io = require("socket.io")(this.serveur);
        this.app.use(express.static("public"));

    }

    demarrer(){

        this.serveur.listen(3000, "10.0.0.247", () => {
            console.log("Le serveur")
        });

            this.io.on("connection", socket => {
            console.log("Nouveau client", socket)

            socket.on("position", this.deplacer.bind(this));
            socket.on("tirer", this.tirer.bind(this));
        })

    }


    deplacer(message) {
        let cible = document.getElementById("cible");
        cible.style.left = (message.ratioX * window.innerWidth) + "px";
        cible.style.top = (message.ratioY * window.innerHeight) + "px";
    }

    tirer() {
        console.log('tirer');


    }

}