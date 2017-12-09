inlets = 1;
outlets = 2;

var ledstate=1;

var oldtrigledval;

var states = new Array(64);
var probs = new Array(64);
var leds1 = new Array(64);
var leds2 = new Array(64);

function clear() {
  ledstate=1;
  for(var i = 0; i<64;i++){
   states[i] = 0;
   leds1[i] = 0;
   leds2[i] = 0;
   probs[i] = 5;
  }
  redraw();
}

function key(x,y,z){
  if(x>=8&&x<16){ //left side
    x = x-8;
    if(ledstate==1){
    states[x + y*8] = (states[x + y*8] + 1)%4;
    leds1[x + y*8] = (states[x+(y*8)])*probs[x+(y*8)]+2;
    if(leds1[x+y*8] ==2){
      leds1[x+y*8] = 0;
    }
    if(states[x + y*8] == 0 || states[x + y*8] == 2){
      ledstate = 1;
    }else if(states[x + y*8] == 1 || states[x + y*8] == 3){
      ledstate = 2;
    }
    redraw();
    outlet(1,states);
    }
    else if(ledstate==2){
    states[x + y*8] = (states[x + y*8] + 1)%4;
    redraw();
    outlet(1,states);
    }
  }
}

function play(count){
  count %= 8;
  var old = (count-1);
  if (old == -1){
    old = 7;
  }
  for(var i=0;i<8;i++){
    if(leds1[i+(old*8)]<4){
      leds1[i+(old*8)] = 0;
      leds2[i+(old*8)] = 0;
    } else if(leds1[i+(old*8)]>=4){
      leds1[i+(old*8)] = oldtrigledval;
    }
  }
  for(var i=0;i<8;i++){
    if(leds1[i+(count*8)]<4){
      leds1[i+(count*8)] = 2;
      leds2[i+(count*8)] = 2;
    } else if(leds1[i+(count*8)]>=4){
      outlet(0,"trig",i);
      oldtrigledval = leds1[i+(count*8)];
      leds1[i+(count*8)] = 15;
    }

  }
  redraw();
}

function redraw(){
  if(ledstate < 2){
    for(var x=0;x<8;x++){
      for(var y=0;y<8;y++){
        var z = leds1[x+(y*8)];
        //x+8 meaning left side of grid;
        outlet(0,"osc","/monome/grid/led/level/set",x+8,y,z);
      }
    }
  }
  else if(ledstate >= 2){
    for(var x=0;x<8;x++){
      for(var y=0;y<8;y++){
        var z = leds2[x+(y*8)];
        //x+8 meaning left side of grid;
        outlet(0,"osc","/monome/grid/led/level/set",x+8,y,z);
      }
    }
  }
}
