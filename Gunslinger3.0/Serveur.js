
const express = require("express");
const http = require("http");



export class Serveur {

    constructor() {

        this.app = express();
        this.serveur = http.createServer(this.app);
        this.io = require("socket.io")(this.serveur);
        this.app.use(express.static("public"));

    }

    demarrer(){

        this.serveur.listen(3000, "192.168.0.199", () => {
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

        let hotspot3 = document.getElementById("hotspot3")
        if(ndgmr.checkRectCollision(cible, hotspot3)){

            console.log('cursd4erd')
    }
    }

    tirer() {
        console.log('tirer');
        let cible = document.getElementById("cible");
    let hotspot3 = document.getElementById("hotspot3")
        if(ndgmr.checkRectCollision(cible, hotspot3)){

            console.log('cursd4erd')
        }






    }

}