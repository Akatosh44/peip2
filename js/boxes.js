/*
@FILE: boxes.js
@AUTHOR : Julien LANGLOIS
@INST: LS2N UMR 6004
*/

var todo_boxes = document.querySelectorAll("div.todo");
for(var i = 0; i < todo_boxes.length; ++i) {
  $(todo_boxes[i]).prepend( "<smallint class='todotitle' ><b>À faire...</b></smallint>" );
};
var selonvous_boxes = document.querySelectorAll("div.selonvous");
for(var i = 0; i < selonvous_boxes.length; ++i) {
  $(selonvous_boxes[i]).prepend( "<smallint class='selonvoustitle' ><b>Selon vous...</b></smallint>" );
};
var definition_boxes = document.querySelectorAll("div.definition");
for(var i = 0; i < definition_boxes.length; ++i) {
  $(definition_boxes[i]).prepend( "<smallint class='definitiontitle' ><b>Définition</b></smallint>" );
};
