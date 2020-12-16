// Code de test rapide *****************************************************************************
// let http = require('http');
//
// let compteur = 0;
//
// let serveur = http.createServer((requete, reponse) => {
//   reponse.end("Allo! #" + ++compteur);
// })
//
// serveur.listen(3000, () => {
//   console.log("Serveur fonctionnel sur le port", serveur.address().port);
// })
// *************************************************************************************************


// Importation des modules de Node.js
let fs = require('fs');
let path = require('path');
let https = require('https');
let SocketIO = require('socket.io');

// Configurations
const config = {
    adresse: "cgilles.dectim.ca",
    port: 3005,
    certificat: fs.readFileSync(path.resolve() + '/securite/certificate.pem'),
    cle: fs.readFileSync(path.resolve() + '/securite/cle.pem')
}

// Instantiation d'un serveur HTTP et d'un serveur de WebSocket utlisant le serveur HTTP comme
// couche de transport
const serveur = https.createServer({key: config.cle, cert: config.certificat});
const io = SocketIO(serveur);

// Démarrage du serveur HTTP
serveur.listen(config.port, config.adresse, () => {
    console.log("Le serveur est prêt et écoute sur le port " + serveur.address().port);
});

// Liste des connexions de toutes les interfaces (appareils mobiles)
let interfaces = [];

// Liste des connexions de tous les jeux (pages web)
let jeux = [];

// Mise en place d'un écouteur pour traiter les connexions de client et les données envoyées par
// ceux-ci.
io.on("connection", socket => {

    // On vérifie si la connexion provient d'une interface ou d'un jeu
    if (socket.handshake.query.type === "interface") {
        gererNouvelleInterface(socket);
    } else if (socket.handshake.query.type === "jeu") {
        gererNouveauJeu(socket);
    } else {
        socket.disconnect();
    }

});

function gererNouvelleInterface(socket) {

    console.log("Connexion d'une interface", socket.handshake.query.codeJeu);

    //let jeuTrouve = jeux.find(jeu => jeu.handshake.query.codeJeu === socket.handshake.query.codeJeu);

    // let jeuTrouve = jeux.filter((unJeu) =>{

    //     return socket.handshake.query.codeJeu === unJeu.handshake.query.codeJeu;
    // });

    // if(jeuTrouve.length===0){
    //     console.log('mauvais ID');
    //     socket.emit("mauvaisID");
    //     //socket.emit('disconnect');
    // }


    let jeuxTrouve = jeux.filter((unJeu) => {
        return socket.handshake.query.codeJeu === unJeu.handshake.query.codeJeu;
    });

    if (jeuxTrouve.length === 0) {
        console.log('mauvais ID');
        socket.emit("mauvaisID");
        socket.emit('disconnect');
        return;
    }


    interfaces.push(socket);

    // if (!interfaces[0]) {
    //     interfaces[0] = socket;

    socket.on("commencer", () => {
        // console.log("go", interfaces[""])
        jeuxTrouve.forEach((unJeu) => {
            unJeu.emit('commencer');
        });
        //jeuTrouve.emit("commencer");
    })

    socket.on("tirer", () => {
        jeuxTrouve.forEach((unJeu) => {
            unJeu.emit('tirer');
        });
        //jeuTrouve.emit("commencer");
    })


    socket.on("esquive", () => {
        //console.log('esquive')
        jeuxTrouve.forEach((unJeu) => {
            unJeu.emit('esquive');
        });
        //jeuTrouve.emit("commencer");
    })

    socket.on("recommencerJeu", () => {
        console.log('recommencerJeu')
        jeuxTrouve.forEach((unJeu) => {
            unJeu.emit('recommencerJeu');
        });
    })


    //  interfaces[""].on("esquive2", () => {
    //      console.log('esquive')
    //      jeuxTrouve.forEach((unJeu)=>{
    //          unJeu.emit('yikes');
    //      });
    //      //jeuTrouve.emit("commencer");
    //  })

    //  interfaces[""].on("esquiveGauche", () => {
    //      jeuxTrouve.forEach((unJeu)=>{
    //          unJeu.emit('esquiveGauche');
    //      });
    //      //jeuTrouve.emit("commencer");
    //  })
//
    //  interfaces[""].on("esquiveDroite", () => {
    //      jeuxTrouve.forEach((unJeu)=>{
    //          unJeu.emit('esquiveDroite');
    //      });
    //      //jeuTrouve.emit("commencer");
    //  })

    socket.on("position", () => {
        jeuxTrouve.forEach((unJeu) => {
            console.log("position")
            unJeu.emit('position');
        });
        //jeuTrouve.emit("commencer");
    })

    socket.on("mouvement", (e) => {
        jeuxTrouve.forEach((unJeu) => {
            unJeu.emit('mouvement', e);
        });
        //jeuTrouve.emit("commencer");
    })

    //  socket.on("commencer", message => {
    //      console.log('go')
    //     jeuTrouve.emit("commencer", message);
    //  });


    // } else {
    //     interfaces.push(socket);
    // }

    // Envoyer une mise à jour à toutes les interfaces pour identifer leur position dans la liste
    // interfaces.forEach((interface, index) => {
    //     if (!interface) return;
    //     interface.emit("position", {position: index})
    // })

    // Ajout d'un écouteur pour détecter la déconnexion d'une interface
    socket.on('disconnect', () => {

        // Identification de l'index de l'interface qui vient de se déconnecter
        // const index = interfaces.indexOf(socket);

        // console.log("Déconnexion de l'interface: ", index);

        // if (index === 0) {
        //     interfaces[""] = null;
        // } else if (index === 1) {
        //     interfaces[1] = null;
        // } else {
        //     interfaces.splice(index, 1);
        // }
        //
        // // Envoyer une mise à jour à toutes les interfaces pour identifer leur position dans la liste
        // interfaces.forEach((interface, index) => {
        //     if (interface === null) return;
        //     interface.emit("position", {position: index})
        // })

    })

}

function gererNouveauJeu(socket) {

    console.log("Connexion d'une page web de jeu", socket.handshake.query.codeJeu);

    jeux.push(socket);

    socket.on('disconnect', () => {
        console.log("Déconnexion d'une page de jeu!", socket.handshake.query.codeJeu);
        jeux = jeux.filter(item => item !== socket)
    });

    socket.on('recommencer', () => {
        console.log("recommencer");
        let interface = interfaces.find(i => {
            return i.handshake.query.codeJeu === socket.handshake.query.codeJeu;
        })
        interface.emit("recommencer",socket.handshake.query.codeJeu)
    });


    socket.on('recommencer2', () => {
        console.log("recommencer2")
        let interface = interfaces.find(i => {
            return i.handshake.query.codeJeu === socket.handshake.query.codeJeu;
        })
        interface.emit("recommencer2",socket.handshake.query.codeJeu)

    });

}

// ws://67.212.82.134:3000/socket.io/?EIO=2&transport=websocket
