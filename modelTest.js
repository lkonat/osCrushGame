var osCrush = (function(){
  var gridListener=[];
  var flipListenner=[];
  var crushAll_effect=[];
  var change_positions=[];
  var goal1=[];
  var tesla_crush=[];
  var manual_grid=false;
  var iconArray=["android.png","apple.png","freebsd.png","linux.png","ubuntu.png","windows.png"];
  var  grid=[       [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0]];
  function setGridManualy(prefered_Grid){
    grid=prefered_Grid;
    manual_grid=true;
  };

  function randomizeGrid(){
    manual_grid=false;
    for(var i =0; i<grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        var rand=Math.floor((Math.random() * 6) + 0);
        grid[i][j]=rand;
      }
    }
  };

  function addListener(type,view){
    if(type==="gridListener"){
      gridListener.push(view);
    }
    if(type==="flipListenner"){
      flipListenner.push(view);
    }
    if(type==="crushAll_effect"){
      crushAll_effect.push(view);
    }if(type==="change_positions"){
      change_positions.push(view);
    } if(type==="goal1"){
      goal1.push(view);
    }
    if(type==="tesla_crush"){
      tesla_crush.push(view);
    }
  };

  function notify_tesla_crush(t,l){
    for(var i=0;i<tesla_crush.length; i++){
      var f=tesla_crush[i];
      f(t,l);
    }
  };

  function notify_Goal1_effect(t,l,type){
    for(var i=0;i<goal1.length; i++){
      var f=goal1[i];
      f(t,l,type);
    }
  };

  function notify_css_position(targetA,targetB){
    for(var i=0;i<change_positions.length; i++){
      var f=change_positions[i];
      f(targetA,targetB);
    }
  };

  function notify_crushAll_effect(topA,leftA){
    for(var i=0;i<crushAll_effect.length; i++){
      var f=crushAll_effect[i];
      f(topA,leftA);
    }
  };

  function notifyGrid(){
    for(var i=0;i<gridListener.length; i++){
      var f=gridListener[i];
      f();
    }
  };

  function notifyFlip(task,argA,argB){
    for(var i=0;i<flipListenner.length; i++){
      var f=flipListenner[i];
      f(task,argA,argB);
    }
  };


  function getIconArray(){
    return iconArray;
  };

  function initialize(prefered_Grid){
    if(!prefered_Grid){
      randomizeGrid();
    }else {
      setGridManualy(prefered_Grid);
    }
      notifyGrid();
      checkGrid();
  };

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
  };

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
  };

  var csp=0;
  function is_special_event(x,y){
    csp++;
    if( csp>=10 && (!has_grid("-2") && !has_grid("-3") && !has_grid("-4"))){ //
      var rand=Math.floor((Math.random() * 4) + 2);
      if(rand===2 || rand===3 ||  rand===4){
        grid[x][y]=-1*rand;
      }
      csp=0;
    }
  };

  function crushAll(x,y){
    for(var i =0; i<grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        if(grid[i][j]===x){
          if(!y){
              grid[i][j]=-1;
          }else {
            notify_crushAll_effect(j*50+(25),i*50+(25));
          }
        }
      }
    }
    notifyGrid();
  };

  function crushAll_tesla(x,y){
    notify_tesla_crush(x,y);
  };

  function has_grid(x){
    for(var i =0; i<grid.length; i++){
      for(var j =0; j<grid[i].length; j++){
        if(grid[i][j]===x){
          return {top:i*50, left:j*50};
        }
      }
    }
    return false;
  };

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
        if(n>=4){
          //console.log("4 matches row");
          //in grid[i][j];
          var type =grid[i][j];
          if(type && type >=0){
            //console.log("type... "+type);
              notify_Goal1_effect(i,j,type);
          }
        }
          for(var w =j; w<j+n; w++ ){
            grid[i][w]=-1;
            notifyGrid();
            is_special_event(i,w);

          }
        }
        if(n2>=3){
          //console.log(iconArray[elt]+" has more than 3 in row "+i+" "+j+"      ;;;;"+n2);
          if(what ==="just_simulation"){
            return true;
          }
          find_any=true;
          if(n2>=4){
            //console.log("4 matches colll");
            var type =grid[i][j];
            if(type && type >=0){
            //  console.log("type... "+type);
                notify_Goal1_effect(i,j,type);
            }

          }
            for(var w =i; w<i+n2; w++ ){
              grid[w][j]=-1;

              notifyGrid();
              is_special_event(i,w);

            }
        }
      }
    }
    return find_any;
  };

    function getGrid(){
      return grid;
    };

    function updateGrid(row,column,elt){
      grid[row][column]=elt;
    };

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
      };
      this.getInstances=function(){
        return {target:this.target,id:this.id, id_temp:this.id_temp,top:this.top, left:this.left};
      };
    };
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

  var condition_first=true;
  var memory={
    firstTarget:false,
    secondTarget:false
  }

  function lastTargetObtained(){
    if(condition_first){return "first"; }
    if(!condition_first){return "second"; }
  };

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
 };
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
    notify_css_position(targetA,targetB);
   }else {
      var diff_top =(parseInt(targetB.top)-targetA.top);
      if(diff_top>0){
        $($(targetB.target)).after($(targetA.id));
      }else {
       $($(targetB.target)).before($(targetA.id));
     }

     notify_css_position(targetA,targetB);
   }
 };

  function flipTargets(){
    flip_Targets(target1,target2);
  };

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
    obtainedTarget:obtainedTarget,
    crushAll:crushAll,
    has_grid:has_grid,
    setGridManualy:setGridManualy,
    crushAll_tesla:crushAll_tesla,
    notifyGrid:notifyGrid
  };
})();
