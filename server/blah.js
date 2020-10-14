let likes = [{ id: 1, name: "noy" }, { id: 2, name: "roy" }]
let all = [{ id: 1, name: "noy" }, { id: 2, name: "roy" }, { id: 3, name: "shiri" }, { id: 3, name: "shiri" }, { id: 3, name: "shiri" }]




function comparer(otherArray){
    return function(current){

      for (var i = 0; i < otherArray.length; i++) {
          if (current.id == otherArray[i].id) {return false} 
      }
      return true
    }
  }
  
  var onlyInA = all.filter(comparer(likes));
  console.log(onlyInA)

// let diffrenece = allVacations.filter(x => x.id === likesVacations.find((item)=>{
//     return item.id == x.id
// }))




