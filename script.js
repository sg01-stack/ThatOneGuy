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
    waveInitialized = false;
});




const follower = {
    x: 0,
    y:0
};

let initialized = false;


const waves = [];
const waveSettings ={
    amplitude: 9,
    wavelength: 113,
    lifetime:98,
    speed: 0.025,
    thickness: 2,
    blur: 3
};

let lastWaveX =0;
let lastWaveY =0;
let waveInitialized = false;

function createWave(x, y)
{
    if(!waveInitialized){
        lastWaveX = x;
        lastWaveY = y;
        waveInitialized = true;
        return;
    }
    const dx =x -lastWaveX;
    const dy =y - lastWaveY;
    const distance = Math.hypot(dx,dy);
    if (distance < 8) {
        return;
    }
    const angle = Math.atan2(dy, dx);
    waves.push({ x:x, y: y, angle: angle, age: 0,phase: Math.random()*Math.PI*2,
        strength: Math.min(distance/30, 1)
    });

    lastWaveX =x;
    lastWaveY=y;
    if(waves.length > 100){
        waves.shift();
    }

}

function drawWave(wave) {
    const progress =wave.age / waveSettings.lifetime;
    const opacity =(1 - progress) * wave.strength* 0.10;
    ctx.save();
    ctx.translate(wave.x, wave.y);
    ctx.rotate(wave.angle);
    ctx.filter = `blur(${waveSettings.blur}px)`;

    ctx.beginPath();

    for(let i= 0; i <= 180; i += 4)
    {
        const x = -i - wave.age * 0.4 ;

        const y = Math.sin(
            i/ waveSettings.wavelength
        * Math.PI * 2 
        + wave.phase
        + wave.age *
        waveSettings.speed
        ) * waveSettings.amplitude
        * (1 + progress);

        if(i === 0){ ctx.moveTo(x,y);
        } else { ctx.lineTo(x,y);

        }

    }
    ctx.strokeStyle=`rgba(12, 229, 204, ${opacity})`;
    ctx.lineWidth = waveSettings.thickness;
    ctx.lineCap ="round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
}

function drawGlow(x,y) {
    const radius =12;
    const gradient = ctx.createRadialGradient( x, y, 0, x, y, radius );
 gradient.addColorStop( 0, "rgba(12, 229, 204, 0.12)");
 gradient.addColorStop( 0.4, "rgba(12, 229, 204, 0.035)");
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
ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(mouse.active) {
        if (!initialized) 
        {
            follower.x = mouse.x;
            follower.y =mouse.y;
            initialized = true;
        } 
        follower.x += (mouse.x - follower.x) * 0.15;
        follower.y +=(mouse.y - follower.y) * 0.15;
        createWave(follower.x, follower.y);
        drawGlow(follower.x, follower.y);

    }
    for (let i = waves.length-1; i >= 0; i--)
    {
        waves[i].age++;

        if (waves[i].age >=
            waveSettings.lifetime) { waves.splice(i,1);
                continue;
            }
            drawWave(waves[i]);
    }
    requestAnimationFrame(animate);
}

animate();
