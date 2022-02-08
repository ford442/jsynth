
let pth=document.getElementById('path').innerHTML;
let ff=new XMLHttpRequest();
ff.open("GET",pth,true);
ff.responseType="arraybuffer";
ff.onload=function(oEvent){
var arrayBuffer=ff.response;
if(arrayBuffer){
var fil=new Uint8ClampedArray(arrayBuffer);
FS.writeFile('/song1.x0x',fil);
}}
ff.send(null);
console.log('Wrote 1 shader to filesystem.');
var statusElement=document.getElementById('status');
var progressElement=document.getElementById('progress');
var Module={preRun:[],postRun:[],print:(function(){
var element=document.getElementById('output');
if(element) element.value='';
return function(text){
if(arguments.length>1)text=Array.prototype.slice.call(arguments).join(' ');
console.log(text);
if(element){
element.value+=text+"\n";
element.scrollTop=element.scrollHeight;
}};})(),printErr:function(text){
if(arguments.length>1)text=Array.prototype.slice.call(arguments).join(' ');
if(0){
dump(text+'\n');
}else{
console.error(text);
}},canvas:(function(){
let canvas=document.getElementById('canvas');
canvas.addEventListener("webglcontextlost",function(e){
alert('WebGL context lost. You will need to reload the page.');
e.preventDefault();
},false);
return canvas;
})(),setStatus:function(text){
if(!Module.setStatus.last){
Module.setStatus.last={
time:Date.now(),text:''
};}
if(text===Module.setStatus.text){
return;
}
var m=text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
var now=Date.now();
if(m&&now-Date.now()<30){
return;
}
if(m){
text=m[1];
progressElement.value=parseInt(m[2],10)*100;
progressElement.max=parseInt(m[4],10)*100;
progressElement.hidden=false;
}else{
progressElement.value=null;
progressElement.max=null;
progressElement.hidden=true;
}
statusElement.innerHTML=text;
},totalDependencies:0,monitorRunDependencies:function(left){
this.totalDependencies=Math.max(this.totalDependencies,left);
Module.setStatus(left?'Preparing... ('+(this.totalDependencies-left)+'/'+this.totalDependencies+')':'All downloads complete.');
}};
Module.setStatus('Downloading...');
window.onerror=function(event){
Module.setStatus('Exception thrown,see JavaScript console');
Module.setStatus=function(text){
if(text){
Module.printErr('[post-exception status] '+text);
}};};
