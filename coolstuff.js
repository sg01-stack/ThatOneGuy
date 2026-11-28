(()=> {
    const canvas = document.getElementById("cosmic-web");
    const ctx =canvas.getContext("2d");
    const config ={
        density: 1100,
        connection: 94,
        movement: 4,
        interaction: 126,
        lineWidth:0.4
    };
    let width = 0 ;
    let height = 0;

    let nodes =[];

    const mouse = {
        x: -999,
        y: -999,
        active: false 
    };

    function resize() {
        const rect = canvas.getBoundingClientRect();
        width =rect.width;
        height =rect.height;

        const dpr = Math.min( window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        nodes =[];
        const count = Math.min(340 ,Math.max(140, Math.floor(width * height / config.density)));
        const clusters =[];
        for (let i = 0; i< 6; i++){
            const heights = [
                0.26,
                0.54,
                0.29,
                0.62,
                0.26,
                0.52
            ];
            clusters.push({x: width *(i +0.5)/6,
                y: height *heights[i]
            });
        }
        for(let i =0;i < count;i++){
            const cluster = clusters[i % clusters.length];
const angle = Math.random()*Math.PI * 2;
const radius = Math.sqrt(Math.random())* 147;
const x= cluster.x + Math.cos(angle) * radius ; const y = cluster.y +Math.sin(angle) * radius;
nodes.push({
    x: Math.max(0, Math.min(width,x)),
    y: Math.max(0, Math.min(height,y)),
 phase: Math.random()*Math.PI*2,
    speed: 0.6 + Math.random() * 0.8 });



       
    }

    }


  resize();

window.addEventListener("resize",resize);
const observer = new
ResizeObserver(resize);
observer.observe(canvas);

window.addEventListener("pointermove",(event)=>{
const rect = canvas.getBoundingClientRect();
mouse.x = event.clientX - rect.left;
mouse.y = event.clientY - rect.top;
mouse.active = true;
});

document.addEventListener("pointerleave", () => {
    mouse.active =false;
});


function moveNodes(time) {

    const positions =[];
    for(const node of nodes) {
        let x = node.x + Math.sin(
            time * node.speed + node.phase 
        ) * config.movement;
          let y = node.y + Math.cos(time * node.speed * 0.8 + node.phase) *config.movement;
        if(mouse.active){
            const dx = x - mouse.x;
            const dy = y - mouse.y;

            const distance= Math.hypot(dx, dy);
            if ( distance > 0 && distance < config.interaction) {
                const force =1- distance/ config.interaction;
                x += dx /distance*force*16;
                y += dy /distance *force*16;
            }
        }
    positions.push({x,y});
    
    }

    return positions;
}

function drawWeb(positions, time) {
    for (let i= 0;i < positions.length;i++) {
        const a = positions[i]; 

        for(let j = i + 1; j< positions.length; j++) {
            const b = positions[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance =Math.hypot(dx,dy);
            if(distance > config.connection) {
                continue;
            }
            const strength = 1 -distance /config.connection ;
            const bend = Math.sin(time * 2 + i*0.7+j*0.3)*7;
            const midX= (a.x + b.x)/2;
            const midY= (a.y + b.y)/2;
            const yellow = (i+j)%41 ===0;
            ctx.strokeStyle =yellow ? `rgba(243, 216, 94, ${strength*0.87})` : `rgba(12, 229, 204, ${strength * 1.02})`;
            ctx.lineWidth = config.lineWidth; ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(midX + bend, midY - bend,b.x, b.y);
            ctx.shadowBlur = 5;
            ctx.shadowColor = yellow ? "#f3d85e" : "#0ce5cc"
            ctx.stroke();
            ctx.shadowBlur = 0;
            if((i+j)% 4 === 0)
            {
                ctx.strokeStyle =`rgba(12, 229, 204, ${strength *0.39})`;
                ctx.lineWidth =0.3;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);

                ctx.quadraticCurveTo( midX -bend *2, midY + bend* 2,b.x, b.y );

                ctx.stroke();

        

    }


        }
    }
}

function drawMicroFilaments(positions,time) {
    for (let i=0; i<positions.length; i += 2){
          const a = positions[i];
          let nearest=null;
          let nearestDistance = 65;

          for(let j =0; j<positions.length; j++) {
            if(i===j)
                continue; 
            
          

          const b= positions[j];
          const distance = Math.hypot(
            b.x - a.x,
            b.y - a.y
          );

          if(distance < nearestDistance)
          {
            nearest=b;
            nearestDistance = distance;
          }
        }
        
     if (!nearest) 
    continue;
  const midX= (a.x + nearest.x)/2;
  const midY=(a.y+nearest.y)/2;
  const sway = Math.sin(time * 3 + i) * 8;

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(
    midX+sway,
    midY+sway,
    nearest.x,
    nearest.y
  );
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = "rgba(12,229, 204, 0.24)";

  ctx.stroke();

}



}


function drawIntersections(positions) {
    for(let i=0; i<positions.length;i++){
        const point = positions[i];
        const yellow = i % 29 === 0;
        ctx.beginPath();
            ctx.arc(
                point.x,
                point.y,
                yellow?1.3 : 0.7,0,
                Math.PI * 2
            );
            ctx.fillStyle = yellow?"rgba(243, 216,94,0.98)": "rgba(12, 229, 204, 0.87)";
            ctx.fill();


        
    }
}

function animate(timestamp) {
    const time = timestamp * 0.00024

    ctx.clearRect(0,0,width,height);

    const positions = moveNodes(time); drawWeb(positions, time);
    drawIntersections(positions);
    drawMicroFilaments(positions,time);
    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);

})()



