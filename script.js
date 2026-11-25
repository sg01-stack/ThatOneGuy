const canvas =document.getElementById("reactive-background");

const  ctx = canvas.getContext("2d");
function resizeCanvas()
{
    canvas.width=window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();
window.addEventListener("resize",resizeCanvas);

const mouse ={ x:0,y:0, active: false};


window.addEventListener("pointermove",(event ) => {
    mouse.x =event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;

}

);

document.addEventListener("pointerleave",()=>{
    mouse.active =false;
    initialized =false;
});




const follower = {
    x: 0,
    y:0
};

let initialized = false;


function drawGlow(x,y) {
    const radius =100;
    const gradient = ctx.createRadialGradient( x, y, 0, x, y, radius );
 gradient.addColorStop( 0, "rgba(12, 229, 204, 0.15)");
 gradient.addColorStop( 0.4, "rgba(12, 229, 204, 0.06)");
 gradient.addColorStop( 1, "rgba(12, 229, 204, 0)");
 ctx.fillStyle = gradient;
 ctx.fillRect(
    x - radius,
    y - radius,
    radius * 2,
    radius * 2
 );
 
}


function animate() {

ctx.globalCompositeOperation ="destination-out";
ctx.fillStyle = "rgba(0, 0, 0, 0.045)";
ctx.fillRect( 0, 0,
    canvas.width,
    canvas.height
);

ctx.globalCompositeOperation ="source-over";

    if(mouse.active) {
        if (!initialized) 
        {
            follower.x = mouse.x;
            follower.y =mouse.y;
            initialized = true;
        } 
        follower.x += (mouse.x - follower.x) * 0.15;
        follower.y +=(mouse.y - follower.y) * 0.15;
        drawGlow(follower.x, follower.y);

    }
    requestAnimationFrame(animate);
}

animate();
