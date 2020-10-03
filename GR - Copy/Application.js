import {Serveur} from "./Serveur.js";

export class Application{
    constructor() {

        nw.Window.get().showDevTools();

        this.serveur = new Serveur()
        this.serveur.demarrer();
    }

}