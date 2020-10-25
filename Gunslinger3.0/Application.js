import {Serveur} from "./Serveur.js";
import {Jeu} from "./Jeu.js";

export class Application{
  constructor() {

    nw.Window.get().showDevTools();


    this.serveur = new Serveur()
    this.serveur.demarrer();
    new Jeu()
  }

}

