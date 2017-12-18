inlets = 1;
outlets = 3;
// task delayer
var Delayer = new Task(delayed);
var delayValue = '';
function delayed() {
  eval(delayValue);
  delayValue = '';
}
function delayThis(a, b) {
  delayValue = a;
  Delayer.schedule(b);
}
function inArray(needle, haystack) {
  var count = haystack.length;
  for (var i = 0; i < count; i++) {
    if (haystack[i] === needle) {
      return 1;
    }
  }
  return 0;
}

var ledstate = 1;
var nmxl;
var states1 = new Array(64);
var leds1 = new Array(64);
var leds2 = new Array(64);
var genrand = new Array(64);
var octs = new Array(8);
var probs = new Array(8);
var fills = new Array(8);
var modes1 = new Array(8);
var notemodes = new Array(8);
var noteouts = new Array(8);
var probmath = new Array(8);
var probrand = new Array(8);
var outs = new Array(8);
var lengths = new Array(8);
var lengthsnum = new Array(8);
outs = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
var morphrand = new Array(8);
var morphnum = new Array(8);
var divs = new Array(8);
var modes2;
var soloouts = [];
var count = [];
var countf = [];
var old = [];
var clockstatus;
var clockbpm;
var tsk = [];
var trigside;

function seq1clear() {
  ledstate = 1;
  modes2 = 4;
  for (var i = 0; i < 64; i++) {
    states1[i] = 0;
    leds1[i] = 0;
    leds2[i] = 0;
    genrand[i] = 5;
  }
  for (var i = 0; i < 8; i++) {
    probs[i] = 5;
    fills[i] = 1;
    modes1[i] = 0;
    notemodes[i] = 1;
    morphrand[i] = 0;
    morphnum[i] = 0;
    divs[i] = 1;
    count[i] = 0;
    countf[i] = 0;
    old[i] = 7;
    outs[i] = new Array(1);
    outs[i][0] = i;
    octs[i] = new Array(1);
    octs[i][0] = 0;
    lengthsnum[i] = 0;
    lengths[i] = 0;
    tsk[i] = [];
  }
  clockstatus = 24;
  clockbpm = clockstatus * 5;
  outlet(0, "clock", clockbpm);
  redraw();
}

function seq1key(x, y, z) {
  // xl is the x of left size
  if (x >= 8) {
    var xl = x - 8;
    if (ledstate == 1) {
      statechanger(xl, y);
    }
    if (ledstate == 2) {
      if (y >= 6 && xl >= 0) {
        var changer1 = xl;
        if (xl == changer1) {
          statechanger(xl, y);
        }
      }
    }
    if (y >= 6 && xl >= 0) {
      if (states1[xl + y * 8] == 0 || states1[xl + y * 8] == 2) {
        ledstate = 1;
      } else if (states1[xl + y * 8] == 1 || states1[xl + y * 8] == 3) {
        delayThis('ledstatemenu()', 500)
      }
    }
    // menus
    for (var i = 0; i < 8; i++) {
      if (states1[i + (6 * 8)] == 1 || states1[i + (6 * 8)] == 3) {
        var nxl = xl;
        notemenu(nxl, y, z);
      }
    }
    if (states1[0 + (7 * 8)] == 1 || states1[0 + (7 * 8)] == 3) {
      clockmenu(xl, y);
    }
    if (states1[1 + (7 * 8)] == 1 || states1[1 + (7 * 8)] == 3) {
      divmenu(xl, y);
    }
    if (states1[2 + (7 * 8)] == 1 || states1[2 + (7 * 8)] == 3) {
      sfmxl = states1[2 + (7 * 8)];
      fillmenu(xl, y);
    }
    if (states1[3 + (7 * 8)] == 1 || states1[3 + (7 * 8)] == 3) {
      probabilitymenu(xl, y);
    }
    if (states1[4 + (7 * 8)] == 1 || states1[4 + (7 * 8)] == 3) {
      lengthmenu(xl, y);
    }
    if (states1[5 + (7 * 8)] == 1 || states1[5 + (7 * 8)] == 3) {
      octavemenu(xl, y, z);
    }
    if (states1[6 + (7 * 8)] == 1 || states1[6 + (7 * 8)] == 3) {
      notemodemenu(xl, y);
    }
    if (states1[7 + (7 * 8)] == 1 || states1[7 + (7 * 8)] == 3) {
      modemenu(xl, y);
    }
    redraw();
  }
}

function statechanger(xl, y) {
  states1[xl + y * 8] = (states1[xl + y * 8] + 1) % 4;
  if (states1[xl + y * 8] == 0) {
    leds1[xl + y * 8] = 0;
  } else if (states1[xl + y * 8] == 1) {
    leds1[xl + y * 8] = 0;
  } else if (states1[xl + y * 8] == 2) {
    leds1[xl + y * 8] = (states1[xl + (y * 8)]) * (probs[xl]) + 2;
  } else if (states1[xl + y * 8] == 3) {
    leds1[xl + y * 8] = (states1[xl + (y * 8)] - 1) * (probs[xl]) + 2;
  }
  if (leds1[xl + y * 8] == 2) {
    leds1[xl + y * 8] = 0;
  }
}

function leds1map(xl, i) {
  leds1[xl + i * 8] = (states1[xl + (i * 8)]) * (probs[xl]) + 2;
  if (leds1[xl + i * 8] == 2) {
    leds1[xl + i * 8] = 0;
  }
}

function ledstatemenu() {
  for (var i = 0; i < 8; i++) {
    for (var j = 7; j > 5; j--) {
      if (states1[i + j * 8] == 1) {
        states1[i + j * 8] = 3;
        ledstate = 2;
      } else if (states1[i + j * 8] == 3) {
        states1[i + j * 8] = 1;
        ledstate = 2;
      }
    }
  }
  redraw();
}

function clockmenu(xl, y) {
  if (y < 6) {
    clockstatus = 48 - ((xl + y * 8));
    clockbpm = clockstatus * 5;
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 6;
    }
    for (var j = 6; j < 8; j++) {
      leds2[i + j * 8] = 0;
    }
    leds2[48 - (clockstatus)] = 12;
  }
  outlet(0, "clock", clockbpm);
}

function divmenu(xl, y) {
  if (y <= 5) {
    divs[xl] = y + 1;
    count[xl] = 0;
    countf[xl] = 0;
    for (var i = 0; i < 8; i++) {
      if (leds1[xl + i * 8] < 4) {
        leds1[xl + i * 8] = 0;
      }
    }
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      leds2[i + j * 8] = 0;
    }
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 6;
    }
    for (var j = 6; j >= 7; j++) {
      leds2[i + j * 8] = 0;
    }
    for (var j = 0; j < divs[i] - 1; j++) {
      leds2[i + j * 8] = 2;
    }
    leds2[i + ((divs[i] - 1) * 8)] = 10;
    leds2[i + 5 * 8] = 2;
    leds2[i + 6 * 8] = 0;
    leds2[i + 7 * 8] = 0;
  }
}

function fillmenu(xl, y) {
  var fillnumb, fillrand;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 4;
    }
    for (var j = 6; j >= 7; j++) {
      leds2[i + j * 8] = 0;
    }
    for (var j = 0; j < 5 - fills[i]; j++) {
      leds2[i + j * 8] = 0;
    }
    leds2[i + ((5 - fills[i]) * 8)] = 10;
    leds2[i + 5 * 8] = 2;
    leds2[i + 6 * 8] = 0;
    leds2[i + 7 * 8] = 0;
  }
  if (y == 0) {
    fills[xl] = 5;
    for (var i = 0; i < 8; i++) {
      states1[xl + i * 8] = 2;
      leds1map(xl, i);
    }
  }
  if (y == 1) {
    fills[xl] = 4;
    for (var i = 0; i < 8; i++) {
      fillrand = Math.random() * 10;
      fillnumb = 8;
      if (fillnumb > fillrand) {
        states1[xl + i * 8] = 2;
        leds1map(xl, i);
      } else if (fillnumb <= fillrand) {
        states1[xl + i * 8] = 0;
        leds1map(xl, i);
      }
    }
  }
  if (y == 2) {
    fills[xl] = 3;
    for (var i = 0; i < 8; i++) {
      fillrand = Math.random() * 10;
      fillnumb = 6;
      if (fillnumb > fillrand) {
        states1[xl + i * 8] = 2;
        leds1map(xl, i);
      } else if (fillnumb <= fillrand) {
        states1[xl + i * 8] = 0;
        leds1map(xl, i);
      }
    }
  }
  if (y == 3) {
    fills[xl] = 2;
    for (var i = 0; i < 8; i++) {
      fillrand = Math.random() * 10;
      fillnumb = 4;
      if (fillnumb > fillrand) {
        states1[xl + i * 8] = 2;
        leds1map(xl, i);
      } else if (fillnumb <= fillrand) {
        states1[xl + i * 8] = 0;
        leds1map(xl, i);
      }
    }
  }
  if (y == 4) {
    fills[xl] = 1;
    for (var i = 0; i < 8; i++) {
      fillrand = Math.random() * 10;
      fillnumb = 2;
      if (fillnumb > fillrand) {
        states1[xl + i * 8] = 2;
        leds1map(xl, i);
      } else if (fillnumb <= fillrand) {
        states1[xl + i * 8] = 0;
        leds1map(xl, i);
      }
    }
  }
  if (y == 5) {
    fills[xl] = 0;
    for (var i = 0; i < 8; i++) {
      states1[xl + i * 8] = 0;
      leds1map(xl, i);
    }
  }
  if (states1[2 + 7 * 8] == 0 || states1[2 + 7 * 8] == 2) {
    states1[2 + 7 * 8] = states1[2 + 7 * 8] - 1;
    if (states1[2 + 7 * 8] == -1) {
      states1[2 + 7 * 8] = 3
    }
  }
}

function probabilitymenu(xl, y) {
  if (y <= 5) {
    probs[xl] = 5 - y;
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 4; j >= 5 - probs[i]; j--) {
      leds2[i + j * 8] = (probs[i] * 2 + 2);
      if (leds2[i + j * 8] == 2) {
        leds2[i + j * 8] = 0;
      }
    }
    for (var j = 0; j <= 4 - probs[i]; j++) {
      leds2[i + j * 8] = 0;
    }
    leds2[i + 5 * 8] = 2;
    leds2[i + 6 * 8] = 0;
    leds2[i + 7 * 8] = 0;
  }
}

function lengthmenu(xl, y) {
  if (y < 6) {
    lengthsnum[xl] = 5 - y;
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 8;
    }
    for (var j = 6; j >= 7; j++) {
      leds2[i + j * 8] = 0;
    }
    for (var j = 0; j < 5 - lengthsnum[i]; j++) {
      leds2[i + j * 8] = 0;
    }
    leds2[i + 5 * 8] = 4;
    leds2[i + 6 * 8] = 0;
    leds2[i + 7 * 8] = 0;
    leds2[i + ((5 - lengthsnum[i]) * 8)] = 10;
    if (lengthsnum[i] == 0) {
      lengths[i] = 0;
    }
    if (lengthsnum[i] == 1) {
      lengths[i] = ((60000 / (clockbpm)) / 2) * 1;
    }
    if (lengthsnum[i] == 2) {
      lengths[i] = ((60000 / (clockbpm)) / 2) * 2;
    }
    if (lengthsnum[i] == 3) {
      lengths[i] = ((60000 / (clockbpm)) / 2) * 4;
    }
    if (lengthsnum[i] == 4) {
      lengths[i] = ((60000 / (clockbpm)) / 2) * 8;
    }
    if (lengthsnum[i] == 5) {
      lengths[i] = ((60000 / (clockbpm)) / 2) * 16;
    }
  }
}

function octavemenu(xl, y, z) {
  if (y <= 5) {
    if (z == 0) {
      if (inArray(60 - (y * 12), octs[xl]) == 1) {
        for (var i = 0; i < octs[xl].length; i++) {
          if (octs[xl][i] == 60 - (y * 12)) {
            octs[xl].splice(i, 1);
          }
        }
      } else if (inArray(60 - (y * 12), octs[xl]) == 0) {
        octs[xl][(octs[xl].length)] = 60 - (y * 12);
      }
    }
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 4;
    }
    for (var j = 0; j < 2; j++) {
      leds2[i + (j + 6) * 8] = 0;
    }
    for (var j = 0; j <= octs[i].length; j++) {
      leds2[i + ((5 - (octs[i][j] / 12)) * 8)] = 10;
    }
  }
}

function notemodemenu(xl, y) {
  if (y < 6) {
    notemodes[xl] = 5 - y;
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 8;
    }
    for (var j = 6; j >= 7; j++) {
      leds2[i + j * 8] = 0;
    }
    for (var j = 0; j < 5 - notemodes[i]; j++) {
      leds2[i + j * 8] = 0;
    }
    leds2[i + 5 * 8] = 2;
    leds2[i + 6 * 8] = 0;
    leds2[i + 7 * 8] = 0;
    leds2[i + ((5 - notemodes[i]) * 8)] = 10;
  }
}

function modemenu(xl, y) {
  if (y <= 2) {
    modes1[xl] = y;
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 3; j++) {
      leds2[i + j * 8] = 4;
    }
    for (var j = 4; j <= 5; j++) {
      leds2[i + j * 8] = 4;
    }
    leds2[i + 3 * 8] = 0;
    leds2[i + (modes1[i] * 8)] = 10;
    leds2[i + (modes2 * 8)] = 10;
  }
  if (y >= 4 && y <= 5) {
    modes2 = y;
  }
}

function notemenu(nxl, y, z) {
  if (y == 6) {
    nmxl = nxl;
  }
  if (y <= 5) {
    if (z == 0) {
      if (inArray(nxl + y * 8, outs[nmxl]) == 1) {
        for (var i = 0; i < outs[nmxl].length; i++) {
          if (outs[nmxl][i] == nxl + y * 8) {
            outs[nmxl].splice(i, 1);
          }
        }
      } else if (inArray(nxl + y * 8, outs[nmxl]) == 0) {
        outs[nmxl][(outs[nmxl].length)] = nxl + y * 8;
      }
    }
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      leds2[i + j * 8] = 2;
    }
    for (var j = 0; j < 2; j++) {
      leds2[i + (j + 6) * 8] = 0;
    }
  }
  for (var i = 0; i < outs[nmxl].length; i++) {
    leds2[outs[nmxl][i]] = 10;
  }
}

function noteoff(n,side) { outlet(0, "trig", side, n, 0); }

function seq1play() {
  var soloouts = [];
  var solorand;
  var wtv1 = new Array(8);
  for (var i = 0; i < 8; i++) {
    if (divs[i] == 6) {
      if (leds1[i + (old[i] * 8)] < 4) {
        leds1[i + (old[i] * 8)] = 0;
      } else if (leds1[i + (old[i] * 8)] >= 4) {
        leds1[i + (old[i] * 8)] = probs[i] * 2 + 2;
      }
      if (leds1[i + (count[i] * 8)] < 4) {
        leds1[i + (count[i] * 8)] = 2;
      }
    } else {
      countf[i] += 1 / divs[i];
      countf[i] %= 8.0;

      count[i] = Math.floor(countf[i]);
      count[i] %= 8.0;

      old[i] = (count[i] - 1);
      if (old[i] == -1) {
        old[i] = 7;
      }
      // if(countf[i]>=(count[i])+.80 || countf[i]<=(count[i])+1.2) {
      if (countf[i] >= count[i]) {
        if (count[i] == 0) {
          if (modes1[i] == 0) {
            // loop
          } else if (modes1[i] == 1) {
            // morph
            morphnum[i] = Math.random() * 8;
            morphnum[i] = Math.floor(morphnum[i]);
            morphrand[i] = Math.random() * 10;
            if (morphrand[i] <= fills[i] * 2) {
              if (states1[i + morphnum[i] * 8] == 0 ||
                  states1[i + morphnum[i] * 8] == 2) {
                states1[i + morphnum[i] * 8] = 2;
              }
              if (states1[i + morphnum[i] * 8] == 1 ||
                  states1[i + morphnum[i] * 8] == 3) {
                states1[i + morphnum[i] * 8] = 1;
              }
              leds1map(i, morphnum[i])
            }
            if (morphrand[i] >= fills[i] * 2) {
              if (states1[i + morphnum[i] * 8] == 0 ||
                  states1[i + morphnum[i] * 8] == 2) {
                states1[i + morphnum[i] * 8] = 0;
              }
              if (states1[i + morphnum[i] * 8] == 1 ||
                  states1[i + morphnum[i] * 8] == 3) {
                states1[i + morphnum[i] * 8] = 3;
              }
              leds1map(i, morphnum[i])
            }
          } else if (modes1[i] == 2) {
            // generative
            for (var j = 0; j < 8; j++) {
              genrand[i + j * 8] = Math.random() * 10;
              if (fills[i] * 2 >= genrand[i + j * 8]) {
                if (states1[i + j * 8] == 0 || states1[i + j * 8] == 2) {
                  states1[i + j * 8] = 2;
                }
                if (states1[i + j * 8] == 1 || states1[i + j * 8] == 3) {
                  states1[i + j * 8] = 1;
                }
                leds1map(i, j);
              }
              if (fills[i] * 2 <= genrand[i + j * 8]) {
                if (states1[i + j * 8] == 0 || states1[i + j * 8] == 2) {
                  states1[i + j * 8] = 0;
                } else if (states1[i + j * 8] == 0 || states1[i + j * 8] == 2) {
                  states1[i + j * 8] = 3;
                }
                leds1map(i, j);
              }
            }
          }
        }
        if (leds1[i + (old[i] * 8)] < 4) {
          leds1[i + (old[i] * 8)] = 0;
        } else if (leds1[i + (old[i] * 8)] >= 4) {
          leds1[i + (old[i] * 8)] = probs[i] * 2 + 2;
        }
        if (leds1[i + (count[i] * 8)] < 4) {
          leds1[i + (count[i] * 8)] = 2;
        }
        if(i < 4){
          trigside = 1;
        }
        else if (i >= 4){
          trigside = 2;
        }
        if (modes2 == 4) {
          // normal
          if (leds1[i + (count[i] * 8)] >= 4) {
            probmath[i] = leds1[i + (count[i] * 8)] - 2; // 0 2 4 6 8 10
            probrand[i] = Math.random() * 10;
            if (probmath[i] > probrand[i]) {
              if (notemodes[i] == 0) {
                var nm0out = Math.floor(Math.random() * outs[i].length);
                var oct0out = Math.floor(Math.random() * octs[i].length);
                outlet(0, "trig", trigside, (outs[i][nm0out] + octs[i][oct0out]));
                leds1[i + (count[i] * 8)] = 15;
              } else if (notemodes[i] > 0) {
                var nmout = [];
                var octout = [];
                for (var j = 0; j < notemodes[i]; j++) {
                  nmout[j] = Math.floor(Math.random() * outs[i].length);
                  octout[j] = Math.floor(Math.random() * octs[i].length);
                  tsk[i][j] = new Task(noteoff,this,outs[i][nmout[j]] + octs[i][octout[j]],trigside);
                  tsk[i][j].repeat(1,lengths[i]);
                  outlet(0, "trig", trigside, (outs[i][nmout[j]] + octs[i][octout[j]]),
                         120);
                  leds1[i + (count[i] * 8)] = 15;
                }
              }
            }
          }
        }
        if (modes2 == 5) {
          // solomode
          if (leds1[i + (count[i] * 8)] >= 4) {
            probmath[i] = (leds1[i + (count[i] * 8)] - 2); // 0 2 4 6 8 10
            probrand[i] = Math.random() * 10;
            if (probmath[i] > probrand[i]) {
              if (notemodes[i] == 0) {
                var nm0out2 = Math.floor(Math.random() * outs[i].length);
                var oct0out2 = Math.floor(Math.random() * octs[i].length);
                soloouts.push(outs[i][nm0out2] + octs[i][oct0out2]);
                wtv1[i] = (outs[i][nm0out2] + octs[i][oct0out2]);
              } else if (notemodes[i] > 0) {
                for (var j = 0; j < notemodes[i]; j++) {
                  var nm0out2 = Math.floor(Math.random() * outs[i].length);
                  var oct0out2 = Math.floor(Math.random() * octs[i].length);
                  soloouts.push(outs[i][nm0out2] + octs[i][oct0out2]);
                  wtv1[i] = (outs[i][nm0out2] + octs[i][oct0out2]);
                }
              }
            }
          }
        }
      }
    }
  }
  if (modes2 == 5) {
    if (soloouts.length > 0) {
      solorand = (Math.floor(Math.random() * soloouts.length));

      for (var i = 0; i < 8; i++) {
        if(i < 4){
          trigside = 1;
        }
        else if (i >= 4){
          trigside = 2;
        }
        if (wtv1[i] == soloouts[solorand]) {
          if (notemodes[i] == 0) {
            outlet(0, "trig", trigside, soloouts[solorand]);
            leds1[i + (count[i] * 8)] = 15;
          } else if (notemodes[i] > 0) {
            for (var j = 0; j < notemodes[i]; j++) {
              tsk[i][j] = new Task(noteoff,this,soloouts[(solorand + j) % soloouts.length],trigside);
              tsk[i][j].repeat(1,lengths[i]);
              outlet(0, "trig", trigside, soloouts[(solorand + j) % soloouts.length],
                     120);
              leds1[i + (count[i] * 8)] = 15;
            }
          }
        }
      }
    }
  }
  redraw();
}

function redraw() {
  if (ledstate == 1) {
    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
        var z = leds1[x + (y * 8)];
        // x+8 meaning left side of grid;
        outlet(0, "osc", "/monome/grid/led/level/set", x + 8, y, z);
      }
    }
  }
  if (ledstate == 2) {
    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
        var z = leds2[x + (y * 8)];
        // x+8 meaning left side of grid;
        outlet(0, "osc", "/monome/grid/led/level/set", x + 8, y, z);
      }
    }
  }
}
