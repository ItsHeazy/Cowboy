let stage;
let chargeur;
let positionX = 0;
let positionY = 0;
charger();
initialiser();

function charger() {
    let manifeste = [
        {id: "vid1", src: "ressources/video1.webm", type:"video"},
        {id: "vid2", src: "ressources/video2.webm", type:"video"}
    ];


chargeur = new createjs.LoadQueue();
chargeur.installPlugin(createjs.Sound);

chargeur.addEventListener('complete', demarre);
chargeur.addEventListener('error', interrompre);
chargeur.loadManifest(manifeste);

}
function interrompre() {
    alert("Une erreur de chargement est survenue!");
}

function initialiser() {

    stage = new createjs.Stage("canvas");
    createjs.Ticker.addEventListener("tick", function(e){
        stage.update(e);
    });

    createjs.Ticker.framerate = 60;
}

function demarre() {
   let video =  new createjs.Bitmap(chargeur.getResult("vid1"));
   video.image.muted = true;
   video.image.loop = true;
   video.image.play();


    let video2 = video.clone();
    let video3 = video.clone();
    let video4 = video.clone();

   let masque1 = new createjs.Shape();
    masque1.graphics.drawRect(0, 0, 250, 250);
    video.mask = masque1;

    let masque2 = new createjs.Shape();
    masque2.graphics.drawRect(250, 0, 250, 250);
    video2.mask = masque2;

    let masque3 = new createjs.Shape();
    masque3.graphics.drawRect(0, 250, 250, 250);
    video3.mask = masque3;

    let masque4 = new createjs.Shape();
    masque4.graphics.drawRect(250, 250, 250, 250);
    video4.mask = masque4;

    stage.addChild(video, video2, video3, video4);

    video2.scaleX = -1;
    video2.x += 500;

    video3.scaleY = -1;
    video3.y += 500;

    video4.scale = -1;
    video4.x += 500;
    video4.y += 500;

    video.regX =  video2.regX =  video3.regX =  video4.regX = video.image.videoWidth / 2;
    video.regY =  video2.regY =  video3.regY =  video4.regY = video.image.videoHeight / 2;

    stage.regX = stage.canvas.width / 2;
    stage.regY = stage.canvas.height /2;

    stage.x = stage.canvas.width / 2;
    stage.y = stage.canvas.width / 2;


    stage.addEventListener("stagemousemove", function (e) {

        let distanceX = positionX - e.stageX;
        let distanceY = positionY - e.stageY;

        video.rotation -= distanceX;
        video2.rotation += distanceX;
        video3.rotation += distanceX;
        video4.rotation -= distanceX;

        positionX = e.stageX;
        positionY = e.stageY;

        stage.rotation += distanceY;
    });

    stage.addEventListener("click", function (e) {

        let source = chargeur.getResult("vid2");
        source.loop = true;
        source.play();
        video.image =  video2.image =  video3.image =  video4.image = source;
    })
}