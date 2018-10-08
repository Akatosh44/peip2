/*
@FILE: libs.js
@AUTHOR : Julien LANGLOIS
@INST: LS2N UMR 6004
*/

function drawmatrixlatex(divlatexcontainer,latexcontainername,sourcevector){
  $(divlatexcontainer).css('visibility','hidden');
  divlatexcontainer.innerHTML = "$\\begin{pmatrix}";
  for(var k= 0; k < 3; ++k) {
    divlatexcontainer.innerHTML = divlatexcontainer.innerHTML + sourcevector[0+3*k] + "&";
    divlatexcontainer.innerHTML = divlatexcontainer.innerHTML + sourcevector[1+3*k] + "&";
    divlatexcontainer.innerHTML = divlatexcontainer.innerHTML + sourcevector[2+3*k] + "\\\\";
  };
  divlatexcontainer.innerHTML = divlatexcontainer.innerHTML + "\\end{pmatrix}$";
    MathJax.Hub.Queue(
      ["Typeset",MathJax.Hub,latexcontainername],
      function () {
        $(divlatexcontainer).css("visibility","visible"); // may have to be "visible" rather than ""
      }
    )
};

function round2dec(number){
  return Math.round(parseFloat(number)*100)/100;
};

function drawMatrixAsTable(matrixdiv,rgbmask=[1.0,1.0,1.0]){
  /*
  NOT THAT SETTINGS SHOULD BE 'JSONED'
  PIXEL VALUES ARE BETWEEN 0 AND 255
  */
  var matrixsettings = JSON.parse(matrixdiv.getAttribute('settings'));
  var matrixvalues = matrixsettings.values;
  var pixelsize = matrixsettings.pixelsize;
  var matrixsize = matrixsettings.matrixsize;
  var pixelclass = matrixsettings.pixelclass;
  //CHECK MATRIX SIZE AND VALUES LIST LENGTH
  if (matrixvalues.length != matrixsize[0]*matrixsize[1]){
    console.log('ERROR:: drawConnectivityMatrix() ASKED TO DRAW A ('+matrixsize[0]+'x'+matrixsize[1]+') MATRIX WHILE PROVIDING '+matrixvalues.length+' VALUES INSTEAD OF '+matrixsize[0]*matrixsize[1]+'.')
  };
  //CREATE TABLE
  var htmltable = ""
  htmltable+='<table style="border-collapse:separate;border-spacing:0px;" class="imgmatrix">';
  for(var i = 0; i < matrixsize[0]; ++i) {
    htmltable+='<tr>';
    for(var j = 0; j < matrixsize[1]; ++j) {
      coord = i*matrixsize[0] + j;
      htmltable+='<td class="'+pixelclass+'" value="'+matrixvalues[coord]+'" coord="('+i+','+j+')" style="border:1px solid gray;width:'+pixelsize+';height:'+pixelsize+';" value='+matrixvalues[coord]+'></div></td>';
    };
    htmltable+='</tr>';
  };
  htmltable+='</table>';
  $(matrixdiv).append(htmltable);
  //COLOR PIXELS
  var pixelsdiv = matrixdiv.querySelectorAll('td');
  for(var i = 0; i < pixelsdiv.length; ++i) {
    $(pixelsdiv[i]).css('background-color','rgb('+rgbmask[0]*matrixvalues[i]+','+rgbmask[1]*matrixvalues[i]+','+rgbmask[2]*matrixvalues[i]+')');
  };
};

function getPixelWithCoord(matrixdiv,coord){
  var pixelsdiv = matrixdiv.querySelectorAll('td');
  for(var j = 0; j < pixelsdiv.length; ++j) {
    if(pixelsdiv[j].getAttribute('coord') == coord){
      return pixelsdiv[j];
    };
  };
  return null;
};

function getMatrixValues(matrixdiv){
  //VALUES SHOULD NOT BE PARSED FROM THE JSON SETTINGS
  //THESE ARE THE INITIAL VAUES
  var pixelsdiv = matrixdiv.querySelectorAll('td');
  var pixelvalues = [];
  for(var j = 0; j < pixelsdiv.length; ++j) {
    pixelvalues.push(pixelsdiv[j].getAttribute('value'));
  };
  return pixelvalues;
};

function colorPixel(pixel,kernelvalue){
  if ((pixel != null) & (kernelvalue=="255")){
    if (pixel.getAttribute('value') == "255"){
      $(pixel).css('background-color','rgb(205,255,205)');
    }else{
      $(pixel).css('background-color','rgb(97,58,58)');
    };
  };
};

function checkPixel(pixel,kernelvalue,countedwhite){
  if ((pixel != null) & (kernelvalue=="255")){
    if (pixel.getAttribute('value') == "255"){
      countedwhite[0] = countedwhite[0] + 1.0;
      countedwhite[1] = countedwhite[1] + 1.0;
    }else{
      countedwhite[0] = countedwhite[0] + 1.0;
    };
  };
};

function checkErodabilities(erosionimagediv,kernelerosion){
  var erosionimagediv = document.getElementById('erosionimage');
  var kernelerosion = document.getElementById('kernelerosion');
  var kernelsettings = JSON.parse(kernelerosion.getAttribute('settings'));
  var kernelvalues = getMatrixValues(kernelerosion);
  var pixelsdiv = erosionimagediv.querySelectorAll('td');
  for(var i = 0; i < pixelsdiv.length; ++i) {
    var line = parseInt(pixelsdiv[i].getAttribute('coord').split('(')[1].split(')')[0].split(',')[0]);
    var column = parseInt(pixelsdiv[i].getAttribute('coord').split('(')[1].split(')')[0].split(',')[1]);
    var countedwhite = [0,0];
    for(var dl = -1; dl < 2; ++dl) {
      for(var dc = -1; dc < 2; ++dc) {
        checkPixel(getPixelWithCoord(erosionimagediv,"("+(line+dl)+","+(column+dc)+")")
        ,kernelvalues[((parseInt(kernelsettings.matrixsize[0])-1)/2+dl)*parseInt(kernelsettings.matrixsize[0])+((parseInt(kernelsettings.matrixsize[0])-1)/2+dc)],
        countedwhite);
      };
    };
    if (countedwhite[0] == countedwhite[1]){
      pixelsdiv[i].setAttribute('erodable','true')
    }else{
      pixelsdiv[i].setAttribute('erodable','false')
    };
  };
};

function checkDilatabilities(dilatationimagediv,kerneldilatation){
  var dilatationimagediv = document.getElementById('dilatationimage');
  var kerneldilatation = document.getElementById('kerneldilatation');
  var kernelsettings = JSON.parse(kerneldilatation.getAttribute('settings'));
  var kernelvalues = getMatrixValues(kerneldilatation);
  var pixelsdiv = dilatationimagediv.querySelectorAll('td');
  for(var i = 0; i < pixelsdiv.length; ++i) {
    var line = parseInt(pixelsdiv[i].getAttribute('coord').split('(')[1].split(')')[0].split(',')[0]);
    var column = parseInt(pixelsdiv[i].getAttribute('coord').split('(')[1].split(')')[0].split(',')[1]);
    var countedwhite = [0,0];
    for(var dl = -1; dl < 2; ++dl) {
      for(var dc = -1; dc < 2; ++dc) {
        checkPixel(getPixelWithCoord(dilatationimagediv,"("+(line+dl)+","+(column+dc)+")")
        ,kernelvalues[((parseInt(kernelsettings.matrixsize[0])-1)/2+dl)*parseInt(kernelsettings.matrixsize[0])+((parseInt(kernelsettings.matrixsize[0])-1)/2+dc)],
        countedwhite);
      };
    };
    if (countedwhite[1]>0){
      pixelsdiv[i].setAttribute('erodable','true')
    }else{
      pixelsdiv[i].setAttribute('erodable','false')
    };
  };
};
