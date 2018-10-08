/*
@FILE: start.js
@AUTHOR : Julien LANGLOIS
@INST: LS2N UMR 6004
*/

window.onload = function () {
  //SCRIPTS
  runCroppingScript();
  runStenopeScript();
  runBinaryScript();
  runGraySliderScript();
  runGrayScript();
  runRgbSlidersScript();
  runRgbScript();
  runThresholdScript();
  runErosionScript();
  runDilatationScript();
  runPerspectiveScript();

  //SOME IMAGES
  drawMatrixAsTable(document.getElementById('connectivity4image'));
  drawMatrixAsTable(document.getElementById('connectivity4image5'));
  drawMatrixAsTable(document.getElementById('connectivity8image'));
  drawMatrixAsTable(document.getElementById('connectivity8image5'));
  drawMatrixAsTable(document.getElementById('imagecontours'));

};
