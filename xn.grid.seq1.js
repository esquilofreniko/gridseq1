inlets = 1;
outlets = 3;

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
var nmxl;
var states1 = new Array(64);
var leds1 = new Array(64);
var leds2 = new Array(64);
var genrand = new Array(64);
var octs = new Array(8);
var probs = new Array(8);
var fills = new Array(8);
var modes1 = new Array(8);
var modes2 = new Array(8);
var probmath = new Array(8);
var probrand  = new Array(8);
var outs  = new Array(8);
outs = [1,2,3,4,5,6,7,8];

function clear() {
  ledstate=1;
  for(var i = 0; i<64;i++){
   states1[i] = 0;
   leds1[i] = 0;
   leds2[i] = 0;
	 genrand[i]=5;
  }
  for(var i=0;i<8;i++){
   probs[i] = 5;
	 fills[i] = 1;
	 octs[i] = 0;
	 modes1[i] = 0;
	 modes2[i] = 5;
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
    if(y>=6&&xl>=0){
      var changer1=xl;
      if(xl == changer1){
        statechanger(xl,y);
        }
      }
  }
  if(y>=6&&xl>=0){
    if(states1[xl + y*8] == 0 || states1[xl + y*8] == 2){
      ledstate=1;
    }else if(states1[xl + y*8] == 1 || states1[xl + y*8] == 3){
      delayThis('ledstatemenu()',500)
    }
  }
  //menus
	for(var i=0;i<8;i++){
		if(states1[i+(7*8)]==1 || states1[i+(7*8)]==3){
				var nxl = xl;
	      notemenu(nxl,y);
	  }
	}
	if(states1[0+(6*8)]==1 || states1[0+(6*8)]==3){
		sfmxl = states1[2+6*8];
		fillmenu(xl,y);
	}
	if(states1[1+(6*8)]==1 || states1[1+(6*8)]==3){
		probabilitymenu(xl,y);
	}
	if(states1[2+(6*8)]==1 || states1[2+(6*8)]==3){
		clockmenu(xl,y);
	}
	if(states1[4+(6*8)]==1 || states1[4+(6*8)]==3){
		octavemenu(xl,y);
	}
	if(states1[7+(6*8)]==1 || states1[7+(6*8)]==3){
		modemenu(xl,y);
	}
  redraw();
  outlet(1,modes1);
	outlet(2,modes2);
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

function leds1map(xl,i){
	leds1[xl + i*8] = (states1[xl+(i*8)])*(probs[xl])+2;
	if(leds1[xl + i*8] ==2){
		leds1[xl + i*8] = 0;
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

function notemenu(nxl,y){
	if(y==7){
		nmxl = nxl;
	}
	for(var i=0;i<8;i++){
		for(var j=0;j<6;j++){
			leds2[i+j*8]=2;
		}
		for(var j=0;j<2;j++){
			leds2[i+(j+6)*8]=0;
		}
	}
	if(y<=5){
		outs[nmxl]=(nxl+y*8)+1;
	}
	leds2[outs[nmxl]-1]=10;
}

function octavemenu(xl,y){
	for(var i=0;i<8;i++){
    for(var j=0;j<6;j++){
      leds2[i+j*8]=5;
		}
		for(var j=6;j>=7;j++){
      leds2[i+j*8]=0;
		}
		leds2[i+((5-(octs[i]/12))*8)]=10;
	}
	if(y<=5){
		octs[xl]= 60 - (y*12);
	}
}

function clockmenu(xl,y){
	for(var i=0;i<8;i++){
    for(var j=0;j<8;j++){
      leds2[i+j*8]=0;
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

function fillmenu(xl,y){
	var fillnumb, fillrand;
	for(var i=0;i<8;i++){
    for(var j=0;j<6;j++){
      leds2[i+j*8]=5;
		}
		for(var j=6;j>=7;j++){
      leds2[i+j*8]=0;
		}
		for(var j=0;j<5-fills[i];j++){
			leds2[i+j*8]=0;
		}
		leds2[i+((5-fills[i])*8)]=10;
	}
	if(y==0){
		fills[xl]=5;
		for(var i=0;i<8;i++){
			states1[xl+i*8] = 2;
			leds1map(xl,i);
		}
	}
	if(y==1){
		fills[xl]=4;
		for(var i=0;i<8;i++){
			fillrand = Math.random()*10;
			fillnumb = 8;
			if(fillnumb>fillrand){
				states1[xl+i*8] = 2;
				leds1map(xl,i);
			} else if(fillnumb<=fillrand){
				states1[xl+i*8] = 0;
				leds1map(xl,i);
			}
		}
	}
	if(y==2){
		fills[xl]=3;
		for(var i=0;i<8;i++){
			fillrand = Math.random()*10;
			fillnumb = 6;
			if(fillnumb>fillrand){
				states1[xl+i*8] = 2;
				leds1map(xl,i);
			} else if(fillnumb<=fillrand){
				states1[xl+i*8] = 0;
				leds1map(xl,i);
			}
		}
	}
	if(y==3){
		fills[xl]=2;
		for(var i=0;i<8;i++){
			fillrand = Math.random()*10;
			fillnumb = 4;
			if(fillnumb>fillrand){
				states1[xl+i*8] = 2;
				leds1map(xl,i);
			} else if(fillnumb<=fillrand){
				states1[xl+i*8] = 0;
				leds1map(xl,i);
			}
		}
	}
	if(y==4){
		fills[xl]=1;
		for(var i=0;i<8;i++){
			fillrand = Math.random()*10;
			fillnumb = 2;
			if(fillnumb>fillrand){
				states1[xl+i*8] = 2;
				leds1map(xl,i);
			} else if(fillnumb<=fillrand){
				states1[xl+i*8] = 0;
				leds1map(xl,i);
			}
		}
	}
	if(y==5){
		fills[xl]=0;
		for(var i=0;i<8;i++){
			states1[xl+i*8] = 0;
			leds1map(xl,i);
		}
	}
	if(states1[0+6*8] == 0 || states1[0+6*8] == 2){
		states1[0+6*8] = states1[0+6*8]-1;
		if(states1[0+6*8]==-1){
			states1[0+6*8]=3
		}
	}
}

function modemenu(xl,y){
	for(var i=0;i<8;i++){
		for(var j=0;j<2;j++){
			leds2[i+j*8]=4;
		}
		leds2[i+2*8]=0;
		for(var j=3;j<6;j++){
			leds2[i+j*8]=4;
		}
		leds2[i+(modes1[i]*8)]=10;
		leds2[i+(modes2[i]*8)]=10;
	}
	if(y<=1){
		modes1[xl]= y;
	}
	if(y<=5&&y>=3){
		modes2[xl]= y;
	}
}

function play(count){
	//modes1 0 - normal / 1 - solo
	//modes2 3 - loop / 4 - morph / 5 - generative
  count %= 8;
	var old = (count-1);
	if (old == -1){
		old = 7;
	}
	if(count == 0){
		for(var i=0;i<8;i++){
			//loop
			if(modes2[i]==3){
			}
			//morph
			else if(modes2[i]==4){
			}
			//generative
			else if(modes2[i]==5){
				for(var j=0;j<8;j++){
					genrand[i+j*8] = Math.random()*10;
					if(fills[i]*2>=genrand[i+j*8]){
						if(states1[i+j*8] == 0 || states1[i+j*8] == 2){
							states1[i+j*8] = 2;
						}
						if(states1[i+j*8] == 1 || states1[i+j*8] == 3){
							states1[i+j*8] = 1;
						}
						leds1map(i,j);
					}
					if(fills[i]*2<=genrand[i+j*8]){
						if(states1[i+j*8] == 0 || states1[i+j*8] == 2){
							states1[i+j*8] = 0;
						}
						else if(states1[i+j*8] == 0 || states1[i+j*8] == 2){
							states1[i+j*8] = 3;
						}
						leds1map(i,j);
					}
				}
			}
		}
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
        outlet(0,"trig",(outs[i]+octs[i]));
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
