export class Interface{


    constructor() {


        this.socket = io("http://10.0.0.247:3000");


        document.querySelector(".images").addEventListener("touchmove", this.gererMouvement.bind(this));

        //document.body.addEventListener("deviceorientation", this.gererMouvement.bind(this), true);
    //       document.body.addEventListener("devicemotion", e => {
    //
    //           console.log(
    //               e.accelerationIncludingGravity.x,
    //               e.accelerationIncludingGravity.y,
    //               e.accelerationIncludingGravity.z
    //           );
    //          if (e.accelerationIncludingGravity.x < -1.5) {
    //               this.gererMouvement();
    //          } else if (e.accelerationIncludingGravity.x > 1.5) {
    //              this.gererMouvement();
    //          } else {
    //              this.paused = true;
    //          }
    //       });
    //
     }




    gererMouvement(e){

        console.log("allo?")
        //Touch Area x=0 y=0 y=247 x=417


         let position = {
             x: e.touches[0].clientX,
             y: e.touches[0].clientY
         }

         let ratio = {
             x: position.x / window.innerWidth,
             y: position.y / window.innerHeight,
         }

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