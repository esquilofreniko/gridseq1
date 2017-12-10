inlets = 1;
outlets = 2;

//task delayer
var Delayer=new Task(delayed);
var delayValue='';

function delayed(){
	eval(delayValue);
	delayValue='';
}
function delayThis(a,b){
	delayValue=a;
	Delayer.schedule(b);
}

var ledstate=1;

var states1 = new Array(64);
var leds1 = new Array(64);
var leds2 = new Array(64);
var probs = new Array(8);
var probmath = new Array(8);
var probrand  = new Array(8);
var outs  = new Array(8);
outs = [0,1,2,3,4,5,6,7];

function clear() {
  ledstate=1;
  for(var i = 0; i<64;i++){
   states1[i] = 0;
   leds1[i] = 0;
   leds2[i] = 0;
  }
  for(var i=0;i<8;i++){
   probs[i] = 5;
  }
  redraw();
}

function key(x,y,z){
  // xl is the x of left size
  var xl = x-8;
  if (ledstate==1){
    statechanger(xl,y);
  }
  if (ledstate==2){
    if(y>5&&xl>=0){
      var changer1=xl;
      if(xl == changer1){
        statechanger(xl,y);
        }
      }
  }
  if(y>5&&xl>=0){
    if(states1[xl + y*8] == 0 || states1[xl + y*8] == 2){
      ledstate=1;
    }else if(states1[xl + y*8] == 1 || states1[xl + y*8] == 3){
      delayThis('ledstatemenu()',500)
    }
  }
  //probability
  if(states1[0+(6*8)]==1 || states1[0+(6*8)]==3){
    probabilitymenu(xl,y);
  }
	for(var i=0;i<8;i++){
		if(states1[i+(7*8)]==1 || states1[i+(7*8)]==3){
				var nxl = xl;
	      notemenu(nxl,y);
	  }
	}
  redraw();
  outlet(1,outs);
}

function statechanger(xl,y){
  states1[xl + y*8] = (states1[xl + y*8] + 1)%4;
  if(states1[xl + y*8]==0){
    leds1[xl + y*8] = 0;
  }else if(states1[xl + y*8]==1){
    leds1[xl + y*8] = 0;
  }else if(states1[xl + y*8]==2){
    leds1[xl + y*8] = (states1[xl+(y*8)])*(probs[xl])+2;
  } else if(states1[xl + y*8]==3){
    leds1[xl + y*8] = (states1[xl+(y*8)]-1)*(probs[xl])+2;
  }
  if(leds1[xl+y*8] ==2){
    leds1[xl+y*8] = 0;
  }
}

function ledstatemenu(){
  for(var i = 0;i<8;i++){
    for(var j= 7;j>5;j--){
      if(states1[i+j*8]==1){
        states1[i+j*8] = 3;
        ledstate = 2;
      }
      else if(states1[i+j*8]==3){
        states1[i+j*8] = 1;
        ledstate = 2;
      }
    }
  }
}

function probabilitymenu(xl,y){
  if(y<=5){
    probs[xl]=5-y;
  }
  for(var i=0;i<8;i++){
    for(var j=4;j>=5-probs[i];j--){
      leds2[i+j*8]=(probs[i]*2+2);
      if(leds2[i+j*8] ==2){
        leds2[i+j*8] = 0;
      }
    }
    for(var j=0;j<=4-probs[i];j++){
      leds2[i+j*8]=0;
    }
    leds2[i+5*8]=0;
    leds2[i+6*8]=0;
  }
}

function notemenu(nxl,y){
		if(y<=5){
			outs[nxl]=nxl+y*8;
		}
	}
  for(var i=0;i<8;i++){
    for(var j=0;j<8;j++){
      leds2[i+j*8]=0;
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
    } else if(leds1[i+(old*8)]>=4){
      leds1[i+(old*8)] = probs[i]*2+2;
    }
  }
  for(var i=0;i<8;i++){
    if(leds1[i+(count*8)]<4){
      leds1[i+(count*8)] = 2;
    } else if(leds1[i+(count*8)]>=4){
      probmath[i] = leds1[i+(count*8)]-2; // 0 2 4 6 8 10
      probrand[i] = Math.random()*10;
      if(probmath[i]>probrand[i]){
        outlet(0,"trig",outs[i]);
        leds1[i+(count*8)] = 15;
      }
    }
  }
  redraw();
}

function redraw(){
  if(ledstate == 1){
    for(var x=0;x<8;x++){
      for(var y=0;y<8;y++){
        var z = leds1[x+(y*8)];
        //x+8 meaning left side of grid;
        outlet(0,"osc","/monome/grid/led/level/set",x+8,y,z);
      }
    }
  }
  if(ledstate == 2){
    for(var x=0;x<8;x++){
      for(var y=0;y<8;y++){
        var z = leds2[x+(y*8)];
        //x+8 meaning left side of grid;
        outlet(0,"osc","/monome/grid/led/level/set",x+8,y,z);
      }
    }
  }
}
