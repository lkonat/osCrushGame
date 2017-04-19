var game = (function(){
  var drawGrid=[];
  var updateABox=[];
  var drawNewBox=[];
  var Viewdelete=[];
  var pioneer =[];
  var destroy =[];
  var isfirstTarget=true;
  var memory=false;
  var troy=false;
  var  grid=[ [0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
  var choice0 =[["004", "051", "062", "011", "025", "031", "045"],["104", "122", "134", "144", "165", "112", "152"],["202", "220", "233", "245", "263", "211", "254"],["303", "312", "320", "331", "354", "360", "341"],["402", "414", "425", "432", "463", "441", "452"],["500", "513", "525", "534", "554", "565", "543"],["605", "610", "621", "634", "654", "660", "645"]];
  var choice1 =[["014", "020", "030", "043", "051", "065", "002"],["110", "121", "135", "140", "150", "165", "100"],["213", "222", "233", "242", "253", "262", "201"],["314", "320", "334", "343", "350", "360", "302"],["405", "410", "423", "432", "444", "453", "460"],["504", "514", "525", "531", "541", "550", "563"],["602", "610", "623", "630", "642", "653", "663"]];
  var choice2 =[["005", "012", "025", "042", "052", "060", "033"],["105", "114", "123", "142", "151", "163", "131"],["244", "252", "263", "231", "203", "214", "224"],["303", "344", "354", "360", "314", "325", "330"],["402", "415", "424", "435", "442", "453", "462"],["500", "510", "552", "560", "525", "530", "542"],["603", "612", "625", "630", "640", "651", "665"]];
  var choices =[choice0,choice1,choice2];

 function setGrid(){
     var rand=Math.floor((Math.random() * 3) + 0);
     for(var i =0; i<grid.length; i++){
       for(var j =0; j<grid[i].length; j++){
         elt = parseInt(choices[rand][i][j].charAt(2));
         grid[i][j]=i+""+j+""+elt;
         notifyGridView(i,j,elt);
       }
     }
 }


  function switchBoxPositionWith(id1,id2){
     var elt1 =findLocationOf(id1); // the position of the first element we want to move
     var elt2 =findLocationOf(id2); // the position of the second element we want to move
     var temp = id1;
     grid[elt1.top][elt1.left]= id2;
     grid[elt2.top][elt2.left]= temp;
     updateALlLocation();
    //  console.log("switched");
  }


 function deleteAll(x){
   var arr=[];
   for(var i =0; i<grid.length; i++){
     for(var j=0; j<grid[i].length; j++){
       if(grid[i][j].charAt(2)===x){
        arr.push(grid[i][j]);
       }
     }
   }
   deleteBoxes(arr,false,true);
 }

var saved=[];
  function deleteDone(ids){
    for(var i =0; i<saved.length; i++){
      var rand=Math.floor((Math.random() * 6) + 0);
      var newId =parseInt(ids[i].charAt(0))+""+ parseInt(ids[i].charAt(1))+""+rand;
      grid[saved[i].top].push(newId);
      notifyGridViewToDrawNewBox(parseInt(ids[i].charAt(0)),parseInt(ids[i].charAt(1)),rand);
    }
   updateALlLocation();
   var check =(checkGrid());
   if(!check){
     var rand=Math.floor((Math.random() * 5) + 0);
     notifyPioneer(rand);
     if(troy){
       notifyTroy(troy);
       troy=false;
     }
   }
  }

 function deleteBoxes(arr,bonnus,effect1){
   saved = [];
   for(var i=0; i<arr.length; i++){
     var elt =findLocationOf(arr[i]);
       if(elt){
        saved.push(elt);
        grid[elt.top].splice(elt.left, 1);
       }
   }
    notifyDeletes(arr,bonnus,effect1);
 }


  function findLocationOf(x){
    var top=false, left=false;
    for(var i =0; i< grid.length; i++){
      if(grid[i].indexOf(x) !== -1){
        top=i; left=grid[i].indexOf(x);
      }
    }
    if(top!==false && left!==false){
      return {top:top, left:left};
     }else {
        return false;
     }
  }

  function updateALlLocation(){
    for(var i =0; i< grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        var elt0 =grid[i][j];
        var p =findLocationOf(elt0);
        if(p){
            notifyBox(elt0,false,p.top,p.left); //put every element to its new place
        }

      }
    }
  }


  function initialize(){
    setGrid();
  //   setTimeout(function(){
  //    checkGrid();
  //  },0);
  }


  function addListener(type,view){
    if(type==="drawGrid"){
      drawGrid.push(view);
    }
    if(type==="updateABox"){
      updateABox.push(view);
    }
    if(type==="drawNewBox"){
      drawNewBox.push(view);
    }if(type==="deleted"){
      Viewdelete.push(view);
    }if(type==="pioneer"){
      pioneer.push(view);
    }if(type==="troy"){
      destroy.push(view);
    }
  }


  function notifyPioneer(who){
    for(var i=0;i<pioneer.length; i++){
      var f=pioneer[i];
      f(who);
    }
  }

  function notifyTroy(position){
    for(var i=0;i<destroy.length; i++){
      var f=destroy[i];
      f(position);
    }
  }

function notifyDeletes(ids,bonnus,effect1){
  for(var i=0;i<Viewdelete.length; i++){
    var f=Viewdelete[i];
    f(ids,bonnus,effect1);
  }
}

  function notifyGridViewToDrawNewBox(top,left,type){
    for(var i=0;i<drawNewBox.length; i++){
      var f=drawNewBox[i];
      f(top,left,type);
    }
  }


  function notifyGridView(top,left,type){
    for(var i=0;i<drawGrid.length; i++){
      var f=drawGrid[i];
      f(top,left,type);
    }
  }


  function notifyBox(id,del,top,left){
    for(var i=0;i<updateABox.length; i++){
      var f=updateABox[i];
      f(id, del,top,left);
    }
  }


  function tryMoveClick(id,itsClass){
    if(itsClass === "boxes"){
      if(isfirstTarget){
        memory=id;
        //console.log("first target set",id);
        isfirstTarget=false;
      }else {
        if(memory !== false){
          if(memory !== id){
            var elt1 =findLocationOf(id), elt2 =findLocationOf(memory);
            if((elt1.left === elt2.left && Math.abs(elt1.top -elt2.top) ===1) || ((elt1.top === elt2.top && Math.abs(elt1.left -elt2.left) ===1)) ){
              switchBoxPositionWith(memory,id);
              if(!checkGrid(false)){
                switchBoxPositionWith(memory,id);
              }else {
                checkGrid();
              }
            }
            //console.log("Switched Position of",memory,id);
            memory=false; //reset the memory
            isfirstTarget=true;
          }else {
            //console.log("same target");
          }
        }
      }
    }else {
      //console.log("wrong target");
    }
  }

  function tryMoveDrag(id,itsClass){
  if(memory !== false){
   if(memory !== id){
     var elt1 =findLocationOf(id), elt2 =findLocationOf(memory);
     if((elt1.left === elt2.left && Math.abs(elt1.top -elt2.top) ===1) || ((elt1.top === elt2.top && Math.abs(elt1.left -elt2.left) ===1)) ){
       switchBoxPositionWith(memory,id);
       if(!checkGrid(false)){
         switchBoxPositionWith(memory,id);
       }else {
         checkGrid(); //success....
       }
     }
     memory=false; //reset the memory
     isfirstTarget=true;
   }else {
    // console.log("same target");
   }
  }
  }


function checkVerticals(elt0,top,left){ //verticals
  var elt =parseInt(elt0.charAt(2));
  var count = 1;
  var startingLeft=false;
  for(var i = left+1; i< grid[top].length; i++){
    if(parseInt(grid[top][i].charAt(2)) !== elt){
      return {count:count, top:top, left:left};
    }
    count++;
    startingLeft=i;
  }
  return {count:count, top:top, left:left};
}

function checkHorizontals(elt0,top,left){ //verticals
  var elt = parseInt(elt0.charAt(2));
  var count = 1;
  //console.log(top+1,left ,grid[0].length);
  for(var i = top+1; i< grid[0].length; i++){
    if(parseInt(grid[i][left].charAt(2)) !== elt){
      return {count:count, top:top, left:left};
    }
    count++;
  }
  return {count:count, top:top, left:left};
}

  function checkGrid(what){
    var elements_todelete=[];
    var detected_3Plus=[];
    var find_any=false;
    for(var i =0; i<grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        var elt=grid[i][j];
        var sidesVerticales =checkVerticals(elt,i,j);
        var sidesHorizontal =checkHorizontals(elt,i,j);
        if(sidesVerticales.count >=3){

          for(var x =sidesVerticales.left; x< sidesVerticales.count+sidesVerticales.left; x++){
            var element=grid[sidesVerticales.top][x];
            if(elements_todelete.indexOf(element) === -1){
              elements_todelete.push(grid[sidesVerticales.top][x]);
            }
          }
          if(sidesVerticales.count>3){
            detected_3Plus.push({count:sidesVerticales.count,type:grid[sidesVerticales.top][sidesVerticales.left].charAt(2)});
            troy={top:sidesVerticales.top,left:sidesVerticales.count+sidesVerticales.left};
          }
        }
        if(sidesHorizontal.count >= 3){
          for(var y = sidesHorizontal.top; y< sidesHorizontal.count + sidesHorizontal.top; y++){
            var element=grid[y][sidesHorizontal.left];
            if(elements_todelete.indexOf(element) === -1){
              elements_todelete.push(grid[y][sidesHorizontal.left]);
            }
          }
          if(sidesHorizontal.count>3){
            detected_3Plus.push({count:sidesHorizontal.count,type:grid[sidesHorizontal.top][sidesHorizontal.left].charAt(2)});
            troy={top:sidesHorizontal.count + sidesHorizontal.top,left:sidesHorizontal.left};
          }
        }
         }
        }
        if(elements_todelete.length>0){
          find_any=true;
          if(what ===false){
            //console.log(elements_todelete.length," Element to delete");
          }else{
              deleteBoxes(elements_todelete,detected_3Plus,false);
          }
        }
    return find_any;
    }

function destroyGridIndex(indexLeft){
  var elements_todelete =[];
  for(var i =0; i<grid.length; i++){
    elements_todelete.push(grid[i][indexLeft]);
  }
  deleteBoxes(elements_todelete,false,false);
}

function getGridIndex(top,left){
  return grid[top][left];
}
  return {
    initialize:initialize,
    addListener:addListener,
    findLocationOf:findLocationOf,
    tryMoveClick:tryMoveClick,
    tryMoveDrag:tryMoveDrag,
    checkGrid:checkGrid,
    findLocationOf:findLocationOf,
    deleteAll:deleteAll,
    deleteDone:deleteDone,
    destroyGridIndex:destroyGridIndex,
    getGridIndex:getGridIndex
  };
})();
