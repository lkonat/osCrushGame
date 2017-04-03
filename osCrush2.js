var osCrush = (function(){
  var gridListener=[];
  var flipListenner=[];
  var iconArray=["android.png","apple.png","freebsd.png","linux.png","ubuntu.png","windows.png"];
  var  grid=[       [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0]
            ];

            function randomizeGrid(){
              for(var i =0; i<grid.length; i++){
                for(var j =0; j<grid[i].length; j++){
                  var rand=Math.floor((Math.random() * 6) + 0);
                  grid[i][j]=rand;
                }
              }
            }

            function addListener(type,view){
              if(type==="gridListener"){
                gridListener.push(view);
              }
              if(type==="flipListenner"){
                flipListenner.push(view);
              }
            }
          function notifyGrid(){
            for(var i=0;i<gridListener.length; i++){
              var f=gridListener[i];
              f();

            }
          }
          function notifyFlip(task,argA,argB){
            for(var i=0;i<flipListenner.length; i++){
              var f=flipListenner[i];
              f(task,argA,argB);

            }
          }


function getIconArray(){
  return iconArray;
}
function initialize(){
    randomizeGrid();
    notifyGrid();
    checkGrid();

}

function checkAdjRight(elt,row,colum){
  var count=1;
  for(var i =colum+1; i<grid[row].length; i++){
    if(grid[row][i]===elt){
      count++;

    }else {
      return count;
    }
  }
  return count;
}
function checkAdjDown(elt,row,colum){
  var count=1;
  for(var i =row+1; i<grid.length; i++){
    if(grid[i][colum]===elt){
      count++;

    }else {
      return count;
    }
  }
  return count;
}
function checkGrid(what){
  var find_any=false;
  for(var i =0; i<grid.length; i++){
    for(var j =0; j<grid[i].length; j++){
      var elt=grid[i][j];
      var n=checkAdjRight(elt,i,j); // n is the number of same element in the row
      var n2=checkAdjDown(elt,i,j);
      if(n>=3){
      //  console.log(iconArray[elt]+" has more than 3 in column  row "+i+" "+j+"      ;;;;"+n);
      if(what ==="just_simulation"){
        return true;
      }
      find_any=true;
        for(var w =j; w<j+n; w++ ){
          grid[i][w]=-1;
          notifyGrid();
        }
      }
      if(n2>=3){
        //console.log(iconArray[elt]+" has more than 3 in row "+i+" "+j+"      ;;;;"+n2);
        if(what ==="just_simulation"){
          return true;
        }
        find_any=true;
          for(var w =i; w<i+n2; w++ ){
            grid[w][j]=-1;
            notifyGrid();
          }
      }
    }
  }
  return find_any;
  }
  function getGrid(){
    return grid;
  }
  function updateGrid(row,column,elt){
    grid[row][column]=elt;
  }

  function Target(){
    this.id=false;
    this.id_temp=false;
    this.top=false;
    this.left=false;
    this.id2=false;
    this.id_string=false;
    this.id_up=false;
    this.target=false;
    this.set =function(e){
      this.target=e.target.offsetParent;
      this.top =parseInt($(e.target.offsetParent).css("top"));
      this.left =parseInt($(e.target.offsetParent).css("left"));
      this.id_string=($(e.target).parents()[1].id); //.....
      this.id=($(e.target).parents()[0]);
      this.id_temp=($(e.target).parents()[0]);
      var elt_position=(parseInt($($(e.target).parents()[0]).css("top"))/50);
      this.id2= ($($(e.target).parents()[1])[0].children[elt_position+1]);
      this.id_up= ($($(e.target).parents()[1])[0].children[elt_position-1]);
      //console.log(this.top,this.id_string);
    };
    this.getInstances=function(){
      return {target:this.target,id:this.id, id_temp:this.id_temp,top:this.top, left:this.left};
    };
  }
  var target1= new Target();
  var target2= new Target();
  function setFirstTarget(e){
    target1.set(e);
  }
  function setSecondTarget(e){
    target2.set(e);
  }
  function getSecondTarget(){

    return target2.getInstances();
  }
  function getFirstTarget(){
    return target1.getInstances();
  }

   function change_css_positions(targetA,targetB){
     var tp =($(targetB.target).css("top"));
     var lt =($(targetB.target).css("left"));
     $(targetA.id).css("top",tp);
     $(targetA.id).css("left",lt);
     $(targetB.target).css("top",targetA.top);
    $(targetB.target).css("left",targetA.left);
   }
   var condition_first=true;
   var memory={
     firstTarget:false,
     secondTarget:false
   }
   function lastTargetObtained(){
     if(condition_first){return "first"; }
     if(!condition_first){return "second"; }
   }

   function obtainedTarget(x,e){
     if(x===1){
       memory.firstTarget=e;
       condition_first=false;
     }else if (x===2) {
       memory.secondTarget=e;
       condition_first=true;
     }else if (x==="return") {
       if(memory.secondTarget && memory.firstTarget){
         return 2;
       }else {
         return false;
       }
     }
   }
  function flip_Targets(targetA,targetB){
    var diff_top =Math.abs(targetA.top-parseInt(targetB.top));
    var diff_left =Math.abs(targetA.left-parseInt(targetB.left));
    if((diff_top!==50 && diff_top!==0) ){condition_first=true;return ;}
    if((diff_top===50 && diff_left!==0) ){condition_first=true;return ;}
    if((diff_left!==50 && diff_left!==0)){condition_first=true;return ;}
    if(targetA.id_string !==targetB.id_string){
      $($(targetB.target)).before($(targetA.id));
    if(!targetA.id2){
     $($("#"+targetA.id_string)).append($(targetB.target));
    }else {
      $($(targetA.id2)).before($(targetB.target));
    }
    change_css_positions(targetA,targetB);
   }else {
      var diff_top =(parseInt(targetB.top)-targetA.top);
      if(diff_top>0){
        $($(targetB.target)).after($(targetA.id));
      }else {
       $($(targetB.target)).before($(targetA.id));
     }
     change_css_positions(targetA,targetB);
   }
  }

  function flipTargets(){
    flip_Targets(target1,target2);
  }
  return {
    initialize:initialize,
    addListener:addListener,
    grid:grid,
    checkAdjDown:checkAdjDown,
    checkAdjRight:checkAdjRight,
    getIconArray:getIconArray,
    checkGrid:checkGrid,
    getGrid:getGrid,
    updateGrid:updateGrid,
    setFirstTarget:setFirstTarget,
    setSecondTarget:setSecondTarget,
    flipTargets:flipTargets,
    getSecondTarget:getSecondTarget,
    getFirstTarget:getFirstTarget,
    lastTargetObtained:lastTargetObtained,
    obtainedTarget:obtainedTarget

  };
})();
