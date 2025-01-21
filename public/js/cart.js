$(document).ready(function() {
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];
  $('#count').html(cartLocal.length);
});


function processSwal(label){
  let timerInterval;
Swal.fire({
  // icon:'success',
  // title: "Auto close alert!",
  // html: "I will close in <b></b> milliseconds.",
  timer: 1000,
  // timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading();
    // const timer = Swal.getPopup().querySelector("b");
    // timerInterval = setInterval(() => {
    //   timer.textContent = `${Swal.getTimerLeft()}`;
    // }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log("I was closed by the timer");
    $('#count').html(label);
  }
});
}


function addtocart(item){
  itemToOBJ = JSON.parse(item);
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || []; // อ่านตะกร้าจาก localStorage หรือเป็น array ว่าง
  var pass =true;

  for(let i=0;i<cartLocal.length;i++){
    if(itemToOBJ._id == cartLocal[i].id){
      cartLocal[i].count ++;
      pass = false;
    }
  }

  if(pass){
  var obj = {
        id: itemToOBJ._id,
        name:itemToOBJ.name,
        description:itemToOBJ.description,
        price:itemToOBJ.price,
        image:itemToOBJ.image,
        count: 1,
      };
      cartLocal.push(obj);
    }
  
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal)); // เก็บตะกร้ากลับลง localStorage
  // $('#count').html(cartLocal.length);
  processSwal(cartLocal.length);
}

//filter
// function filterSelection(){}

//cart remove item
function cartRemoveitem(removeId){
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];
  cartLocal = cartLocal.filter(function(item) {
    return item.id !== removeId;
  });
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal));
}

function cartUpdateitem(){
  
}