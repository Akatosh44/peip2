/*
@FILE: scripts.js
@AUTHOR : Julien LANGLOIS
@INST: LS2N UMR 6004
*/

function runCroppingScript(){
  var Cropper = window.Cropper;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var actions = document.getElementById('actions');
  var options = {
    aspectRatio: 16/9,
    cropBoxResizable: false,
    rotatable: false,
    zoomable: false,
    scalable: false,
    minContainerWidth: 480,
    minContainerHeight: 320,
    autoCropArea: 0.5,
  };
  var cropper = new Cropper(image, options);
  actions.querySelector('.docs-buttons').onclick = function(event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var option = target.getAttribute('data-option');
    var option = {};
    var radios = document.getElementsByName('sensor_size');
    for (var i = 0, length = radios.length; i < length; i++){
      if (radios[i].checked){
        option['width']=1.0*radios[i].value;
        break;
      };
    };
    var result = cropper['getCroppedCanvas'](option,undefined);
    if (result) {
      $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
      $('#getCroppedCanvasModal').modal().find('.modal-body').find('canvas').css('width','100%');
      $('#getCroppedCanvasModal').modal().find('.modal-body').find('canvas').css('height','100%');
    };
  };
};

function runBinaryScript(){
  //BLACK AND WHITE IMAGE
  var imgtable = document.getElementById('blackandwhiteimg');
  drawMatrixAsTable(imgtable);
  var tablepixels = imgtable.querySelectorAll('td');
  var latexdiv = document.getElementById('blackandwhitelatex');
  drawmatrixlatex(latexdiv,"blackandwhitelatex",getMatrixValues(imgtable));
  for(var i = 0; i < tablepixels.length; ++i) {
    tablepixels[i].onclick = function(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var pixelvalue = target.getAttribute('value');
      if (pixelvalue=='0'){
        $(target).css('background','white');
        target.setAttribute("value","255");
      }else{
        $(target).css('background','black');
        target.setAttribute("value","0");
      }
      drawmatrixlatex(latexdiv,"blackandwhitelatex",getMatrixValues(imgtable));
    };
  };
};

function runGrayScript(){
  //GRAY IMAGE
  var imgtable = document.getElementById('grayimg');
  drawMatrixAsTable(imgtable);
  var latexdiv = document.getElementById('graylatex');
  drawmatrixlatex(latexdiv,"graylatex",getMatrixValues(imgtable));
};

function runRgbScript(){
  //RED
  var redimgtable = document.getElementById('rgbrimg');
  drawMatrixAsTable(redimgtable,rgbmask=[1.0,0.0,0.0]);
  var redtablepixels = redimgtable.querySelectorAll('td');
  var redlatexdiv = document.getElementById('rgbrlatex');
  drawmatrixlatex(redlatexdiv,"rgbrlatex",getMatrixValues(redimgtable));
  //GREEN
  var greenimgtable = document.getElementById('rgbgimg');
  drawMatrixAsTable(greenimgtable,rgbmask=[0.0,1.0,0.0]);
  var greentablepixels = greenimgtable.querySelectorAll('td');
  var greenlatexdiv = document.getElementById('rgbglatex');
  drawmatrixlatex(greenlatexdiv,"rgbglatex",getMatrixValues(greenimgtable));
  //BLUE
  var blueimgtable = document.getElementById('rgbbimg');
  drawMatrixAsTable(blueimgtable,rgbmask=[0.0,0.0,1.0]);
  var bluetablepixels = blueimgtable.querySelectorAll('td');
  var bluelatexdiv = document.getElementById('rgbblatex');
  drawmatrixlatex(bluelatexdiv,"rgbblatex",getMatrixValues(blueimgtable));
  //RGB
  var rgbimgtable = document.getElementById('rgbimg');
  drawMatrixAsTable(rgbimgtable);
  var rgbtablepixels = rgbimgtable.querySelectorAll('td');
  //RANDOMIZE BUTTON
  var rdbutn = document.getElementById('randomrgbimagebutton');
  rdbutn.onclick = function(event) {
    for(var i = 0; i < 9; ++i) {
      //RED
      var pixelvalue = Math.floor(Math.random() * 256);
      redtablepixels[i].setAttribute('value',pixelvalue);
      $(redtablepixels[i]).css('background-color','rgb('+1.0*pixelvalue+',0,0)');
      //GREEN
      pixelvalue = Math.floor(Math.random() * 256);
      greentablepixels[i].setAttribute('value',pixelvalue);
      $(greentablepixels[i]).css('background-color','rgb(0,'+1.0*pixelvalue+',0)');
      //BLUE
      pixelvalue = Math.floor(Math.random() * 256);
      bluetablepixels[i].setAttribute('value',pixelvalue);
      $(bluetablepixels[i]).css('background-color','rgb(0,0,'+1.0*pixelvalue+')');
      //RGB
      $(rgbtablepixels[i]).css('background-color','rgb('+1.0*redtablepixels[i].getAttribute('value')+','+1.0*greentablepixels[i].getAttribute('value')+','+1.0*bluetablepixels[i].getAttribute('value')+')');
    };
    drawmatrixlatex(redlatexdiv,"rgbrlatex",getMatrixValues(redimgtable));
    drawmatrixlatex(greenlatexdiv,"rgbglatex",getMatrixValues(greenimgtable));
    drawmatrixlatex(bluelatexdiv,"rgbblatex",getMatrixValues(blueimgtable));
  };
};

function runThresholdScript(){
  //THRESHOLD IMAGE SCRIPT
  var imgtable = document.getElementById("thresholdimg");
  drawMatrixAsTable(imgtable);
  var tablepixels = imgtable.querySelectorAll('td');
  var thresholdMatrixValues = JSON.parse(document.querySelector('div#thresholdlatex').getAttribute('values')).values;
  var latexdiv = document.getElementById('thresholdlatex');
  drawmatrixlatex(latexdiv,"thresholdlatex",thresholdMatrixValues);
  var thresholdslider = document.getElementById("thresholdslider");
  var thresholdslidervalue = document.getElementById("thresholdslidervalue");
  thresholdslidervalue.innerHTML = "<p>T="+thresholdslider.value+"</p>";
  thresholdslider.oninput = function() {
    thresholdslidervalue.innerHTML = "<p>T="+thresholdslider.value+"</p>";
    for(var i = 0; i < tablepixels.length; ++i) {
      var pixelcolor = 1.0*thresholdMatrixValues[i];
      if (pixelcolor < 1.0*thresholdslider.value){
        $(tablepixels[i]).css('background-color','rgb(0,0,0)');
      }else{
        $(tablepixels[i]).css('background-color','rgb(255,255,255)');
      };
    };
  };
};

function runGraySliderScript(){
  //GRAY SLIDER
  var grayslider = document.getElementById("graycolorrange");
  var grayslideroutput = document.getElementById("graycolorshow");
  var grayslideroutputtext = document.getElementById("graycolorshowtext");
  graycolorshowtext.innerHTML = '<small>p = '+grayslider.value+'</small>';
  $(grayslideroutput).css('background-color','rgb('+1.0*grayslider.value+','+1.0*grayslider.value+','+1.0*grayslider.value+')');
  grayslider.oninput = function() {
    graycolorshowtext.innerHTML = '<small>p = '+grayslider.value+'</small>';
    $(grayslideroutput).css('background-color','rgb('+1.0*grayslider.value+','+1.0*grayslider.value+','+1.0*grayslider.value+')');
  };
};

function runRgbSlidersScript(){
  //RED SLIDER
  var redslider = document.getElementById("redcolorrange");
  var redslideroutput = document.getElementById("redcolorshow");
  redslideroutput.innerHTML = '<small style="color:white;vertical-align:middle;">'+redslider.value+'</small>';
  $(redslideroutput).css('background-color','rgb('+1.0*redslider.value+',0,0)');
  //GREEN SLIDER
  var greenslider = document.getElementById("greencolorrange");
  var greenslideroutput = document.getElementById("greencolorshow");
  greenslideroutput.innerHTML = '<small style="color:white;vertical-align:middle;">'+greenslider.value+'</small>';
  $(greenslideroutput).css('background-color','rgb(0,'+1.0*greenslider.value+',0)');
  //BLUE SLIDER
  var blueslider = document.getElementById("bluecolorrange");
  var blueslideroutput = document.getElementById("bluecolorshow");
  blueslideroutput.innerHTML = '<small style="color:white;vertical-align:middle;">'+blueslider.value+'</small>';
  $(blueslideroutput).css('background-color','rgb(0,0,'+1.0*blueslider.value+')');
  //RGB OUTPUT SHOW
  var rgbslideroutput = document.getElementById("rgbcolorshow");
  $(rgbslideroutput).css('background-color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
  $(rgbslideroutput).css('color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
  redslider.oninput = function() {
    redslideroutput.innerHTML = '<small style="color:white;vertical-align:middle;">'+redslider.value+'</small>';
    $(redslideroutput).css('background-color','rgb('+1.0*redslider.value+',0,0)');
    $(rgbslideroutput).css('background-color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
    $(rgbslideroutput).css('color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
  };
  greenslider.oninput = function() {
    greenslideroutput.innerHTML = '<small style="color:white;vertical-align:middle;">'+greenslider.value+'</small>';
    $(greenslideroutput).css('background-color','rgb(0,'+1.0*greenslider.value+',0)');
    $(rgbslideroutput).css('background-color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
    $(rgbslideroutput).css('color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
  };
  blueslider.oninput = function() {
    blueslideroutput.innerHTML = '<small style="color:white;vertical-align:middle;">'+blueslider.value+'</small>';
    $(blueslideroutput).css('background-color','rgb(0,0,'+1.0*blueslider.value+')');
    $(rgbslideroutput).css('background-color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
    $(rgbslideroutput).css('color','rgb('+1.0*redslider.value+','+1.0*greenslider.value+','+1.0*blueslider.value+')');
  };
};

function runPerspectiveScript(){
  var perspectivesourcediv = document.getElementById('perspectivesvgsource');
  var perspectivedestdiv = document.getElementById('perspectivesvgdest');
  function getMousePosition(evt,svgdiv) {
    var CTM = svgdiv.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  };
  var sourcecoordinates = [[0,0],[0,0],[0,0],[0,0]];
  var destcoordinates = [[0,0],[0,0],[0,0],[0,0]];
  function updateCoordinates(){
    var pointssourcesvg = perspectivesourcediv.querySelectorAll('circle');
    for (var i = 0; i<pointssourcesvg.length;++i){
      sourcecoordinates[i] = [parseFloat(pointssourcesvg[i].getAttribute('cx')),parseFloat(pointssourcesvg[i].getAttribute('cy'))];
    };
    var pointsdestsvg = perspectivedestdiv.querySelectorAll('circle');
    for (var i = 0; i<pointsdestsvg.length;++i){
      destcoordinates[i] = [parseFloat(pointsdestsvg[i].getAttribute('cx')),parseFloat(pointsdestsvg[i].getAttribute('cy'))];
    };
  };
  updateCoordinates();
  var perspectivelatexValues = JSON.parse(document.querySelector('div#perspectivelatex').getAttribute('values')).values;
  function perspectiveMatrixComputation(){
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [sourcecoordinates[0][0], sourcecoordinates[0][1], sourcecoordinates[1][0],
      sourcecoordinates[1][1], sourcecoordinates[2][0], sourcecoordinates[2][1], sourcecoordinates[3][0], sourcecoordinates[3][1]]);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [destcoordinates[0][0], destcoordinates[0][1], destcoordinates[1][0],
      destcoordinates[1][1], destcoordinates[2][0], destcoordinates[2][1], destcoordinates[3][0], destcoordinates[3][1]]);
    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    for(var i = 0 ; i < M.data64F.length ; ++i){
      perspectivelatexValues[i] = round2dec(M.data64F[i]);
    };
    drawmatrixlatex(document.getElementById('perspectivelatex'),"perspectivelatex",perspectivelatexValues);
  };
  perspectiveMatrixComputation();
  function makeDynamic(svgdiv){
    var currentPoint = false;
    svgdiv.addEventListener('mousedown', startDrag);
    svgdiv.addEventListener('mousemove', drag);
    svgdiv.addEventListener('mouseup', endDrag);
    svgdiv.addEventListener('mouseleave', endDrag);
    function startDrag(evt) {
        if (evt.target.classList.contains('draggablePoint')) {
          currentPoint = evt.target;
          offset = getMousePosition(evt,svgdiv);
          offset.x -= parseFloat(currentPoint.getAttributeNS(null, "cx"));
          offset.y -= parseFloat(currentPoint.getAttributeNS(null, "cy"));
        };
    };
    function drag(evt) {
      if (currentPoint) {
        evt.preventDefault();
        var coord = getMousePosition(evt,svgdiv);
        currentPoint.setAttributeNS(null, "cx", coord.x - offset.x);
        currentPoint.setAttributeNS(null, "cy", coord.y - offset.y);
      };
    };
    function endDrag(evt) {
      if (currentPoint){
        updateCoordinates();
        perspectiveMatrixComputation();
      };
      currentPoint = false;
    };
  };
  makeDynamic(perspectivesourcediv);
  makeDynamic(perspectivedestdiv);
};

function runStenopeScript(){
  var stenopemodel = document.getElementById('stenopesvg');
  var sensor = stenopemodel.querySelector('line#sensor');
  var lens = stenopemodel.querySelector('line#lens');
  var lenstext = stenopemodel.querySelector('text#lenstext');
  var focal = stenopemodel.querySelector('line#focal');
  var borderup = stenopemodel.querySelector('line#borderup');
  var borderdown = stenopemodel.querySelector('line#borderdown');
  var object = stenopemodel.querySelector('line#object');
  var objecttext = stenopemodel.querySelector('text#objecttext');
  var objectup = stenopemodel.querySelector('line#objectup');
  var objectdown = stenopemodel.querySelector('line#objectdown');
  var oproj = stenopemodel.querySelector('line#oproj');
  var focalslider = document.getElementById("focalslider");
  var focalslidervalue = document.getElementById("focalslidervalue");
  var objectslider = document.getElementById("objectslider");
  var objectslidervalue = document.getElementById("objectslidervalue");
  var objectsensorsize = document.getElementById('objectsensorsize');
  var maxstenopex = 800;
  var orig = parseFloat(sensor.getAttribute('x1'));
  focalslidervalue.innerHTML = "<small>f="+(parseFloat(focalslider.value)-parseFloat(lens.getAttribute('x1')))+"mm</small>";
  objectslidervalue.innerHTML = "<small>Z="+focalslider.value+"mm</small>";
  object.setAttribute('x1',objectslider.value);
  object.setAttribute('x2',objectslider.value);
  objecttext.setAttribute('x',parseInt(objectslider.value)+15);
  lens.setAttribute('x1',focalslider.value);
  lens.setAttribute('x2',focalslider.value);
  function updateStenope(){
    var fy = 0.5*(parseFloat(lens.getAttribute('y1'))+parseFloat(lens.getAttribute('y2')));
    var uy = parseFloat(sensor.getAttribute('y2'));
    var dy = parseFloat(sensor.getAttribute('y1'));
    var uoy = parseFloat(object.getAttribute('y1'));
    var ox = parseFloat(object.getAttribute('x1'));
    var doy = parseFloat(object.getAttribute('y2'));
    var fx = parseFloat(lens.getAttribute('x1'));
    var a1 = (fy-uy)/(fx-orig);
    var a2 = (fy-uoy)/(fx-ox);
    lenstext.setAttribute('x',fx-20);
    objecttext.setAttribute('x',ox+15);
    borderup.setAttribute('x1',orig);
    borderup.setAttribute('y1',uy);
    borderup.setAttribute('x2',maxstenopex);
    borderup.setAttribute('y2',a1*(maxstenopex-orig)+uy);
    borderdown.setAttribute('x1',orig);
    borderdown.setAttribute('y1',dy);
    borderdown.setAttribute('x2',maxstenopex);
    borderdown.setAttribute('y2',-a1*(maxstenopex-orig)+dy);
    objectup.setAttribute('x1',ox);
    objectup.setAttribute('y1',uoy);
    objectup.setAttribute('x2',orig);
    objectup.setAttribute('y2',a2*(orig-ox)+uoy);
    objectdown.setAttribute('x1',ox);
    objectdown.setAttribute('y1',doy);
    objectdown.setAttribute('x2',orig);
    objectdown.setAttribute('y2',-a2*(orig-ox)+doy);
    oproj.setAttribute('x1',orig);
    oproj.setAttribute('y1',a2*(orig-ox)+uoy);
    oproj.setAttribute('x2',orig);
    oproj.setAttribute('y2',-a2*(orig-ox)+doy);
    objectsensorsize.innerHTML = "xc="+Math.round((a2*(orig-ox)+uoy) - (-a2*(orig-ox)+doy))+"mm";
    objectslidervalue.innerHTML = "<small>Z="+(parseFloat(objectslider.value)-lens.getAttribute('x1'))+"mm</small>";
  };
  updateStenope();
  focalslider.oninput = function() {
    focalslidervalue.innerHTML = "<small>f="+(parseFloat(focalslider.value)-orig)+"mm</small>";
    lens.setAttribute('x1',focalslider.value);
    lens.setAttribute('x2',focalslider.value);
    objectslidervalue.innerHTML = "<small>Z="+(parseFloat(objectslider.value)-lens.getAttribute('x1'))+"mm</small>";
    updateStenope();
  };
  objectslider.oninput = function() {
    objectslidervalue.innerHTML = "<small>Z="+(parseFloat(objectslider.value)-lens.getAttribute('x1'))+"mm</small>";
    object.setAttribute('x1',objectslider.value);
    object.setAttribute('x2',objectslider.value);
    updateStenope();
  };
  var stenopeformula = document.getElementById('stenopeformula');
  stenopeformula.onclick = function() {
    $(stenopeformula.querySelector('div#stenopeformulalatex')).css('visibility','visible');
    $(stenopeformula.querySelector('div#stenopeformulamark')).css('visibility','hidden');
    $(stenopeformula).css('border','none');
    $(stenopeformula).removeClass('goldhover');
  };
};

function runErosionScript(){
  //OUTPUT
  var erosionimageresultdiv = document.getElementById('erosionimageresult');
  drawMatrixAsTable(erosionimageresultdiv);
  function clearOutput(erosionimageresultdiv){
    var pixelsresultdiv = erosionimageresultdiv.querySelectorAll('td');
    for(var i = 0; i < pixelsresultdiv.length; ++i) {
      $(pixelsresultdiv[i]).css('background-color','rgb(200,200,200)');
      pixelsresultdiv[i].innerHTML = "<msall><small>?</small></small>";
    };
  };
  clearOutput(erosionimageresultdiv);
  //INPUTS
  var erosionimagediv = document.getElementById('erosionimage');
  drawMatrixAsTable(erosionimagediv);
  var kernelerosion = document.getElementById('kernelerosion');
  drawMatrixAsTable(kernelerosion);
  checkErodabilities(erosionimagediv,kernelerosion);
  var kernelsettings = JSON.parse(kernelerosion.getAttribute('settings'));
  var kernelpixelsdiv = kernelerosion.querySelectorAll('td');
  var pixelsdiv = erosionimagediv.querySelectorAll('td');
  for(var i = 0; i < pixelsdiv.length; ++i) {
    pixelsdiv[i].onmouseover = function(event){
      var kernelvalues = getMatrixValues(kernelerosion);
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var line = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[0]);
      var column = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[1]);
      for(var dl = -1; dl < 2; ++dl) {
        for(var dc = -1; dc < 2; ++dc) {
          colorPixel(getPixelWithCoord(erosionimagediv,"("+(line+dl)+","+(column+dc)+")")
          ,kernelvalues[((parseInt(kernelsettings.matrixsize[0])-1)/2+dl)*parseInt(kernelsettings.matrixsize[0])+((parseInt(kernelsettings.matrixsize[0])-1)/2+dc)]);
        };
      };
    };
    pixelsdiv[i].onmouseout = function(event){
      for(var j = 0; j < pixelsdiv.length; ++j) {
        if (pixelsdiv[j].getAttribute('value') == "255"){
          $(pixelsdiv[j]).css('background-color','white');
        }else{
          $(pixelsdiv[j]).css('background-color','black');
        };
      };
    };
    pixelsdiv[i].onclick = function(event){
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var line = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[0]);
      var column = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[1]);
      var p = getPixelWithCoord(erosionimageresultdiv,"("+line+","+column+")")
      if(target.getAttribute('erodable') == 'false'){
        $(p).css('background-color','black');
        p.innerHTML = "";
      }else{
        $(p).css('background-color','white');
        p.innerHTML = "";
      };
    };
  };
  var runbutton = document.getElementById('erodeall');
  runbutton.onclick = function(event){
    for(var i = 0; i < pixelsdiv.length; ++i) {
      pixelsdiv[i].click();
    };
  };
  var cleanbutton = document.getElementById('unerodeall');
  cleanbutton.onclick = function(event){
    clearOutput(erosionimageresultdiv);
  };
  //KERNEL DYNAMIC MODIFICATION
  for(var i = 0; i < kernelpixelsdiv.length; ++i) {
    kernelpixelsdiv[i].onclick = function(event){
      var e = event || window.event;
      var target = e.target || e.srcElement;
      if (target.getAttribute('value') == "255"){
        $(target).css('background-color','black');
        target.setAttribute("value","0");
      }else{
        $(target).css('background-color','white');
        target.setAttribute("value","255");
      };
      clearOutput(erosionimageresultdiv);
      var kernelerosion = document.getElementById('kernelerosion');
      checkErodabilities(erosionimagediv,kernelerosion);
    };
  };
};

function runDilatationScript(){
  //OUTPUT
  var dilatationimageresultdiv = document.getElementById('dilatationimageresult');
  drawMatrixAsTable(dilatationimageresultdiv);
  function clearOutput(dilatationimageresultdiv){
    var pixelsresultdiv = dilatationimageresultdiv.querySelectorAll('td');
    for(var i = 0; i < pixelsresultdiv.length; ++i) {
      $(pixelsresultdiv[i]).css('background-color','rgb(200,200,200)');
      pixelsresultdiv[i].innerHTML = "<msall><small>?</small></small>";
    };
  };
  clearOutput(dilatationimageresultdiv);
  //INPUTS
  var dilatationimagediv = document.getElementById('dilatationimage');
  drawMatrixAsTable(dilatationimagediv);
  var kerneldilatation = document.getElementById('kerneldilatation');
  drawMatrixAsTable(kerneldilatation);
  checkDilatabilities(dilatationimagediv,kerneldilatation);
  var kernelsettings = JSON.parse(kerneldilatation.getAttribute('settings'));
  var kernelpixelsdiv = kerneldilatation.querySelectorAll('td');
  var pixelsdiv = dilatationimagediv.querySelectorAll('td');
  for(var i = 0; i < pixelsdiv.length; ++i) {
    pixelsdiv[i].onmouseover = function(event){
      var kernelvalues = getMatrixValues(kerneldilatation);
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var line = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[0]);
      var column = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[1]);
      for(var dl = -1; dl < 2; ++dl) {
        for(var dc = -1; dc < 2; ++dc) {
          colorPixel(getPixelWithCoord(dilatationimagediv,"("+(line+dl)+","+(column+dc)+")")
          ,kernelvalues[((parseInt(kernelsettings.matrixsize[0])-1)/2+dl)*parseInt(kernelsettings.matrixsize[0])+((parseInt(kernelsettings.matrixsize[0])-1)/2+dc)]);
        };
      };
    };
    pixelsdiv[i].onmouseout = function(event){
      for(var j = 0; j < pixelsdiv.length; ++j) {
        if (pixelsdiv[j].getAttribute('value') == "255"){
          $(pixelsdiv[j]).css('background-color','white');
        }else{
          $(pixelsdiv[j]).css('background-color','black');
        };
      };
    };
    pixelsdiv[i].onclick = function(event){
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var line = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[0]);
      var column = parseInt(target.getAttribute('coord').split('(')[1].split(')')[0].split(',')[1]);
      p = getPixelWithCoord(dilatationimageresultdiv,"("+line+","+column+")")
      if(target.getAttribute('erodable') == 'false'){
        $(p).css('background-color','black');
        p.innerHTML = "";
      }else{
        $(p).css('background-color','white');
        p.innerHTML = "";
      };
    };
  };
  var runbutton = document.getElementById('dilateall');
  runbutton.onclick = function(event){
    for(var i = 0; i < pixelsdiv.length; ++i) {
      pixelsdiv[i].click();
    };
  };
  var cleanbutton = document.getElementById('undilateall');
  cleanbutton.onclick = function(event){
    clearOutput(dilatationimageresultdiv);
  };
  //KERNEL DYNAMIC MODIFICATION
  for(var i = 0; i < kernelpixelsdiv.length; ++i) {
    kernelpixelsdiv[i].onclick = function(event){
      var e = event || window.event;
      var target = e.target || e.srcElement;
      if (target.getAttribute('value') == "255"){
        $(target).css('background-color','black');
        target.setAttribute("value","0");
      }else{
        $(target).css('background-color','white');
        target.setAttribute("value","255");
      };
      clearOutput(dilatationimageresultdiv);
      var kerneldilatation = document.getElementById('kerneldilatation');
      checkDilatabilities(dilatationimagediv,kerneldilatation);
    };
  };
};
