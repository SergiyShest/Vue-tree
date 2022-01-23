

function HasContent(item) {
    if (item.Content.length > 0) {        
      return true;
    }
    for (var i = 0; i < item.children.length; i++) {
      var element = item.children[i];
      if (HasContent(element)) {          
        return true;
      }
    }
    return false;
  }
function  GetEmptyItems(pitem)
{  //;var name=
   var chaild=[];
   for (var i = 0; i < pitem.children.length; i++) {
     var item=this.items[i];
     if(this.HasNotContent(item)){
        this.chaild.push(item);
        this.initEmptyItems(item);
     }
   }
   pitem.children=chaild;
}
    
function initNotEmptyItems(pitem)
{
   var chaild=[];
   for (var i = 0; i < pitem.children.length; i++) {
     var item= data.children[i];
     if(this.HasContent(item)){
        chaild.push(item);
        this.initNotEmptyItems(item);
     }
   }
   pitem.children=chaild;
}

function Clone(obj){
    const clone = JSON.parse(JSON.stringify(obj));
    return clone;
}
function HasNotContent(item) {
    if(item.Content.length == 0 &&item.children.length==0 )
    {
      return true;//not content and chaild
    }
 
    for (var i = 0; i < item.children.length; i++) {
      var element = item.children[i];
      if (HasNotContent(element)) {          
        return true;
      }
    }
    return false;
  } 

function IsEmpty(item) {
    if(item.Content.length == 0 &&item.children.length==0 )
    {
      return true;//not content and chaild
    }

    return false;
  } 
  

function RemoveEmpty(item) {
    var emptyItems=[];
    for (var i = 0; i < item.children.length; i++) {
      var chaild = item.children[i];
       RemoveEmpty(chaild) 
       if(IsEmpty(chaild)){
          emptyItems.push(chaild) 
       }
    }
    for (var i = 0; i < emptyItems.length; i++) {
      item.children=arrayRemove(item.children,emptyItems[i])  ;
    }

  } 
function RemoveFilled(item) {
    var filledItems=[];
    for (var i = 0; i < item.children.length; i++) {
      var chaild = item.children[i];
      RemoveFilled(chaild) 
       if(chaild.Content.length>0){
        filledItems.push(chaild) 
       }
    }
    for (var i = 0; i < filledItems.length; i++) {
      item.children=arrayRemove(item.children,filledItems[i])  ;
    }

  } 
  
  function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}
  
 export  function getEmptyTree(tree){
  var cloneTree=Clone(tree);
    RemoveFilled(cloneTree)

 return cloneTree;

}

 export  function getFilledTree(tree){
  var cloneTree=Clone(tree);
      RemoveEmpty(cloneTree)

 return cloneTree;

}

