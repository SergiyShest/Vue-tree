


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
function GetEmptyItems(pitem) {  //;var name=
  var chaild = [];
  for (var i = 0; i < pitem.children.length; i++) {
    var item = this.items[i];
    if (this.HasNotContent(item)) {
      this.chaild.push(item);
      this.initEmptyItems(item);
    }
  }
  pitem.children = chaild;
}

function initNotEmptyItems(pitem) {
  var chaild = [];
  for (var i = 0; i < pitem.children.length; i++) {
    var item = data.children[i];
    if (this.HasContent(item)) {
      chaild.push(item);
      this.initNotEmptyItems(item);
    }
  }
  pitem.children = chaild;
}

function Clone(obj) {
  const clone = JSON.parse(JSON.stringify(obj));
  return clone;
}
function HasNotContent(item) {
  if (item.Content.length == 0 && item.children.length == 0) {
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
  if (item.Content.length == 0 && item.children.length == 0) {
    return true;//not content and chaild
  }

  return false;
}


function RemoveEmpty(item) {
  var emptyItems = [];
  for (var i = 0; i < item.children.length; i++) {
    var chaild = item.children[i];
    RemoveEmpty(chaild)
    if (IsEmpty(chaild)) {
      emptyItems.push(chaild)
    }
  }
  for (var i = 0; i < emptyItems.length; i++) {
    item.children = arrayRemove(item.children, emptyItems[i]);
  }

}
function RemoveFilled(item) {
  var filledItems = [];
  for (var i = 0; i < item.children.length; i++) {
    var chaild = item.children[i];
    RemoveFilled(chaild)
    if (chaild.Content.length > 0) {
      filledItems.push(chaild)
    }
  }
  for (var i = 0; i < filledItems.length; i++) {
    item.children = arrayRemove(item.children, filledItems[i]);
  }

}



function arrayRemove(arr, value) {

  return arr.filter(function (ele) {
    return ele != value;
  });
}
 function hasFiltredInChaild(items, filterString,predicatFunction) {
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (predicatFunction(item, filterString)){
      return true;
    }
      
    if(hasFiltredInChaild(item.children, filterString,predicatFunction))
     return true;
  }
return false;

}
function getFiltredItems(items, filterString,predicatFunction) {

  let remItems = [];

  for (let index = 0; index < items.length; index++) {
    const item = items[index];

    if (!predicatFunction(item, filterString)&& !hasFiltredInChaild(item.children, filterString,predicatFunction)) {
      remItems.push(item);
    }else
    {
       item.children= getFiltredItems(item.children, filterString,predicatFunction) 
    }
  }
  remItems.forEach(element => {
  console.log("remove "+element.Name)
  items = arrayRemove(items,element);
});

  return items;
}

function nameFunction(item,filterString){

  return item.Name.toLowerCase().includes(filterString.toLowerCase());
}


export   function getFiltredTree(items, filterString) {

    if (hasFiltredInChaild(items, filterString,nameFunction)) {
     
      var clonedItems = Clone(items);
      return getFiltredItems(clonedItems, filterString,nameFunction);
    }
    else {
      return []
    }

   

  }

  export function getEmptyTree(tree) {
    var cloneTree = Clone(tree);
    RemoveFilled(cloneTree)

    return cloneTree;

  }

  export function getFilledTree(tree) {
    var cloneTree = Clone(tree);
    RemoveEmpty(cloneTree)

    return cloneTree;

  }

  export function generateGuid() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  
