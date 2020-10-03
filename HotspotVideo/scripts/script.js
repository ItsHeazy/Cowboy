let stage;
let chargeur;

charger();
initialiser();

function charger() {
    let manifeste = [
        {id: "vid1", src: "ressources/rendu.mp4", type:"video"},
        {id: "vid2", src: "ressources/money.mp4", type:"video"},
        {id: "vid3", src: "ressources/Pink.mp4", type:"video"},
        {id: "vid4", src: "ressources/MH.mp4", type:"video"},
        {id: "vid5", src: "ressources/ch.mp4", type:"video"}
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
   let video1 =  new createjs.Bitmap(chargeur.getResult("vid1"));
   video1.image.muted = true;
   video1.image.loop = true;
   video1.image.play();


    let video2 = video1.clone();
    let video3 = video1.clone();
    let video4 = video1.clone();


    stage.addChild(video1, video2, video3, video4);

  //  stage.addEventListener("click", function (e) {
   //     let source = chargeur.getResult("vid2");
  //      source.loop = true;
    //    source.play();
    //    video.image =  video2.image =  video3.image =  video4.image = source;
    //})

    let el1 = document.getElementById("hotspot1");
    el1.addEventListener("click", function(){
        let source = chargeur.getResult("vid4");
        source.play();
        video2.image.play();
        video2.image.muted = true;
        video1.image =  video2.image =  video3.image =  video4.image = source;
        document.querySelector("#hotspot1").style.display ="none";
        document.querySelector("#hotspot2").style.display ="block";
        document.querySelector("#hotspot3").style.display ="block";
    });

    let el2 = document.getElementById("hotspot2");
    el2.addEventListener("click", function(){
        let source = chargeur.getResult("vid5");
        source.play();
        video3.image.play();
        video3.image.muted = true;
        video1.image =  video2.image =  video3.image =  video4.image = source;
        document.querySelector("#hotspot2").style.display ="none";
        document.querySelector("#hotspot1").style.display ="block";
        document.querySelector("#hotspot3").style.display ="block";
    });

    let el3 = document.getElementById("hotspot3");
    el3.addEventListener("click", function(){
        let source = chargeur.getResult("vid3");
        source.play();
        video1.image.play();
        video1.image.muted = true;
        video1.image =  video2.image =  video3.image =  video4.image = source;
        document.querySelector("#hotspot3").style.display ="none";
        document.querySelector("#hotspot1").style.display ="block";
        document.querySelector("#hotspot3").style.display ="block";
    });
}