var game = (function(){
  var drawGrid=[];
  var updateABox=[];
  var drawNewBox=[];
  var Viewdelete=[];
  var pioneer =[];
  var destroy =[];
  var bouclier =[];
  var soundsListener=[];
  var isfirstTarget=true;
  var memory=false;
  var troy=false;
  // the grid set to zero
  var  grid=[ [0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
    // three differents setting for the grid that the game will choose randomly to start the game
  var choice0 =[["004", "051", "062", "011", "025", "031", "045"],["104", "122", "134", "144", "165", "112", "152"],["202", "220", "233", "245", "263", "211", "254"],["303", "312", "320", "331", "354", "360", "341"],["402", "414", "425", "432", "463", "441", "452"],["500", "513", "525", "534", "554", "565", "543"],["605", "610", "621", "634", "654", "660", "645"]];
  var choice1 =[["014", "020", "030", "043", "051", "065", "002"],["110", "121", "135", "140", "150", "165", "100"],["213", "222", "233", "242", "253", "262", "201"],["314", "320", "334", "343", "350", "360", "302"],["405", "410", "423", "432", "444", "453", "460"],["504", "514", "525", "531", "541", "550", "563"],["602", "610", "623", "630", "642", "653", "663"]];
  var choice2 =[["005", "012", "025", "042", "052", "060", "033"],["105", "114", "123", "142", "151", "163", "131"],["244", "252", "263", "231", "203", "214", "224"],["303", "344", "354", "360", "314", "325", "330"],["402", "415", "424", "435", "442", "453", "462"],["500", "510", "552", "560", "525", "530", "542"],["603", "612", "625", "630", "640", "651", "665"]];
  var choices =[choice0,choice1,choice2];

 function setGrid(){ //to initiate the grid randomly by using one of the three choices
     var rand=Math.floor((Math.random() * 3) + 0);
     for(var i =0; i<grid.length; i++){
       for(var j =0; j<grid[i].length; j++){
         elt = parseInt(choices[rand][i][j].charAt(2));
         grid[i][j]=i+""+j+""+elt;
         notifyGridView(i,j,elt); // notify the view
       }
     }
 }


  function switchBoxPositionWith(id1,id2){ //to switch two boxes position
     var elt1 =findLocationOf(id1); // the position of the first element we want to move
     var elt2 =findLocationOf(id2); // the position of the second element we want to move
     var temp = id1;
     grid[elt1.top][elt1.left]= id2;
     grid[elt2.top][elt2.left]= temp;
     updateALlLocation(); // update the view
     playSound("switch"); // play the sound switch
     console.log("ss");
    //  console.log("switched");
  }


 function deleteAll(x){ // to delete all the kind of a specific element from the game
   var arr=[];//array that will stored all the element to be deleted
   for(var i =0; i<grid.length; i++){
     for(var j=0; j<grid[i].length; j++){
       if(x){  // if there is a parameter
         if(grid[i][j].charAt(2)===x){ //if the element is the same kind to the parameter
          arr.push(grid[i][j]);
         }
       }else { // if there is no parameter
         arr.push(grid[i][j]);
       }
     }
   }
   deleteBoxes(arr,false,true); // now  delete all the selectioned elements  with effect but no bonnus
 }

var saved=[];// an array to save the information about the elements that were just deleted.

  function deleteDone(ids){ // this is a function that will be call when the view is done deleting elements
    //this first step get the id of the deleted element and only change its last character witch is the type, so we do not need to keep generating new numbers Infinitly for ids
    for(var i =0; i<saved.length; i++){ //go through those saved one
      var rand=Math.floor((Math.random() * 6) + 0); //choose a random number between 0 and 6, 0 is android , 1 is apple.....etc..
      var newId =parseInt(ids[i].charAt(0))+""+ parseInt(ids[i].charAt(1))+""+rand; // create a new id with conbinaison of the position of the deleted element's top and left with the random number
      grid[saved[i].top].push(newId); //add the new bid at the end of the grid array a this specific column
      notifyGridViewToDrawNewBox(parseInt(ids[i].charAt(0)),parseInt(ids[i].charAt(1)),rand); // notify the view about the new boxes created
    }
   updateALlLocation(); //update the view by puting everything to its new place
   var check =(checkGrid()); //check the grid if there is a match after we just updated the elements positions
   if(!check){ //if no match found
     notifyBouclier(); //remove the shield so user can now play again
     var rand=Math.floor((Math.random() * 5) + 0); // create a random number
     notifyPioneer(rand); //use the random number to choose an OS that will the target of the pioner effect, notify the view
     if(troy){ // if troy special effect is there
       notifyTroy(troy); //notify the view
       troy=false; // reset troy to false
     }
   }
  }

 function deleteBoxes(arr,bonnus,effect1){ // this function notify the view to delete boxes
   saved = []; // save all the boxes that need to be deleted to an array so we can use their position later to generate new ids for new comming elements
   for(var i=0; i<arr.length; i++){ //go throught all the elemnts that need to be deleted
     var elt =findLocationOf(arr[i]); // find their position on the gameboard
       if(elt){ // if they exits
        saved.push(elt); // save the position
        grid[elt.top].splice(elt.left, 1); // remove them from the grid
       }
   }
    notifyDeletes(arr,bonnus,effect1); // notify the view
 }


  function findLocationOf(x){ //this function can find the position of element pass to it, if they exist on the board
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

  function updateALlLocation(){ // this function go through the grid, find the current position of each element and notify the view. Note that all the element have an id which is different from their  position.
    for(var i =0; i< grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        var elt0 =grid[i][j];// get the element id
        var p =findLocationOf(elt0); //find its position on the grid
        if(p){
            notifyBox(elt0,false,p.top,p.left); //notify the view to put every element to its new place
        }

      }
    }
  }

  function initialize(){ // initialize the game
    setGrid(); //set the grid
  }


  function addListener(type,view){ /// used to add listenner
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
    }if(type==="bouclier"){
      bouclier.push(view);
    }
    if(type==="soundListenner"){
      soundsListener.push(view);
    }
  }

  function notifySoundListener(which){
    for(var i=0;i<soundsListener.length; i++){
      var f=soundsListener[i];
      f(which);
    }
  }


  function notifyBouclier(){
    for(var i=0;i<bouclier.length; i++){
      var f=bouclier[i];
      f();
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

  function playSound(which){
    notifySoundListener(which);
  }


  function tryMoveClick(id,itsClass){ //function check if a movement is legal and update the view
    if(itsClass === "boxes"){ // if what user clicked one is has a  class Name boxes, which means that it is an OS
      if(isfirstTarget){ // if it is  the first target we are setting
        memory=id; //put in memory
        playSound("press");
        //console.log("first target set",id);
        isfirstTarget=false; //first target is set now
      }else { //it is  the second target we are setting
        if(memory !== false){ // just to make sure we have a first target in memory
          if(memory !== id){ //if the first target is different than the second target
            var elt1 =findLocationOf(id), elt2 =findLocationOf(memory); //find the location of both the first and second target
             // check if they are neighbors
            if((elt1.left === elt2.left && Math.abs(elt1.top -elt2.top) ===1) || ((elt1.top === elt2.top && Math.abs(elt1.left -elt2.left) ===1)) ){
              switchBoxPositionWith(memory,id); //switch their position if they are neighbors

                if(!checkGrid(false)){ // if the switch does not leads to a match, it is ilegal
                  playSound("denied"); //play sound denied
                  switchBoxPositionWith(memory,id); // switch the position back to their old positions
                }else { // if the switch does leads to a match, it is legal
                  playSound("bomb1"); // play bonb sound
                  checkGrid(); // check the grid again
                }

            }else{ //  they are not neighbors
              console.log("no");
              playSound("denied");
            }
            //console.log("Switched Position of",memory,id);
            memory=false; //reset the memory
            isfirstTarget=true; //reset firstTarget to be true so we can set it again
          }else { // user click on the same target twice
            //console.log("same target");
            playSound("negative");
          }
        }
      }
    }else {
      //console.log("wrong target");
    }
  }

  function tryMoveDrag(id,itsClass){ //function check if a movement is legal after a drag, and update the view
  if(memory !== false){// just to make sure we have a first target in memory
   if(memory !== id){ //if the first target is different than the second target
     var elt1 =findLocationOf(id), elt2 =findLocationOf(memory);  //find the location of both the first and second target
     if((elt1.left === elt2.left && Math.abs(elt1.top -elt2.top) ===1) || ((elt1.top === elt2.top && Math.abs(elt1.left -elt2.left) ===1)) ){
       switchBoxPositionWith(memory,id); //switch their position if they are neighbors
         if(!checkGrid(false)){ // if the switch does not leads to a match, it is ilegal
           playSound("denied");
           switchBoxPositionWith(memory,id); // switch the position back to their old positions
         }else {
           playSound("bomb1");
           checkGrid(); //check the grid again
         }
     }
     memory=false; //reset the memory
     isfirstTarget=true;
   }else {
    // console.log("same target");
    //playSound("negative");
   }
  }
  }


function checkVerticals(elt0,top,left){ //check  for more than 2 verticals matchs in the grid
  var elt =parseInt(elt0.charAt(2));
  var count = 1; // to keep track of how many same elemnt are direct neighbors
  for(var i = left+1; i< grid[top].length; i++){
    if(parseInt(grid[top][i].charAt(2)) !== elt){
      return {count:count, top:top, left:left};
    }
    count++;
  }
  return {count:count, top:top, left:left};
}

function checkHorizontals(elt0,top,left){ //check  for more than 2 horizontal matchs in the grid
  var elt = parseInt(elt0.charAt(2));
  var count = 1; // to keep track of how many same elemnt are direct neighbors
  for(var i = top+1; i< grid[0].length; i++){
    if(parseInt(grid[i][left].charAt(2)) !== elt){
      return {count:count, top:top, left:left};
    }
    count++;
  }
  return {count:count, top:top, left:left};
}

  function checkGrid(what){ //function that check if there are more than 2  macthes in the grid
    var elements_todelete=[]; //array that will contains all the element that needto be deleted
    var detected_3Plus=[]; //array that will contains all the element that has more than 3 matches
    var find_any=false; // boolean for if we find any matches
    for(var i =0; i<grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        var elt=grid[i][j];
        var sidesVerticales =checkVerticals(elt,i,j); // check grid verticaly
        var sidesHorizontal =checkHorizontals(elt,i,j); // check grid horizontaly
        if(sidesVerticales.count >=3){  //if the vertical grid check has 3 or more  than 3 element that are similar and are neighbors
          for(var x =sidesVerticales.left; x< sidesVerticales.count+sidesVerticales.left; x++){ //go through them
            var element=grid[sidesVerticales.top][x]; //get each element
            if(elements_todelete.indexOf(element) === -1){ //if the element does not already exist inside the the array we are deleting element later
              elements_todelete.push(grid[sidesVerticales.top][x]); //put the element inside the array we are deleting elements later
            }
          }
          if(sidesVerticales.count>3){   //if the vertical grid check has more  than 3 element that are similar and are neighbors, it is a bonnus
            detected_3Plus.push({count:sidesVerticales.count,type:grid[sidesVerticales.top][sidesVerticales.left].charAt(2)}); // put in the array
            troy={top:sidesVerticales.top,left:sidesVerticales.count+sidesVerticales.left}; // set troy, the special effect
          }
        }
        if(sidesHorizontal.count >= 3){  //if the horizontal grid check has 3 or more  than 3 element that are similar and are neighbors
          for(var y = sidesHorizontal.top; y< sidesHorizontal.count + sidesHorizontal.top; y++){
            var element=grid[y][sidesHorizontal.left];
            if(elements_todelete.indexOf(element) === -1){
              elements_todelete.push(grid[y][sidesHorizontal.left]);
            }
          }
          if(sidesHorizontal.count>3){  //if the horizontal grid check has  more  than 3 element that are similar and are neighbors
            detected_3Plus.push({count:sidesHorizontal.count,type:grid[sidesHorizontal.top][sidesHorizontal.left].charAt(2)});
            troy={top:sidesHorizontal.count + sidesHorizontal.top,left:sidesHorizontal.left};
          }
        }
         }
        }
        if(elements_todelete.length>0){ // if the elements_todelete has element in it
          find_any=true; //we find some element to be deleted
          if(what ===false){ //if there is a parameter passed to this function
            // do not do anything , this was just a similation to see if there will be matches when user move a particular box
          }else{ //if there were no parameter passed to this function, that means we can delete
              deleteBoxes(elements_todelete,detected_3Plus,false);  // delete the matches found, with troy effect, if any. and not pionner effect
          }
        }
    return find_any; // return true if any matches found
    }

function destroyGridIndex(indexLeft){ // this function can be called by the view to delete a specific index from a row inside the grid
  var elements_todelete =[];
  for(var i =0; i<grid.length; i++){
    elements_todelete.push(grid[i][indexLeft]);
  }
  deleteBoxes(elements_todelete,false,false);
}

function getGridIndex(top,left){ // this function return the id of a specific location in the grid
  return grid[top][left];
}
  return {
    initialize:initialize,
    addListener:addListener,
    findLocationOf:findLocationOf,
    tryMoveClick:tryMoveClick,
    tryMoveDrag:tryMoveDrag,
    checkGrid:checkGrid,
    deleteAll:deleteAll,
    deleteDone:deleteDone,
    destroyGridIndex:destroyGridIndex,
    getGridIndex:getGridIndex
  };
})();
