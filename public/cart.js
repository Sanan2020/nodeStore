function addTest(obj){
  console.log(obj['_id']);

}


function processSwal(){
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
    // $('#count').html(cart.length);
  }
});

}


var cart=[];
function addtocart(value_id){
  processSwal();
  // // console.log(value_id);

  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || []; // อ่านตะกร้าจาก localStorage หรือเป็น array ว่าง
  var pass =true;
  // console.log(cartLocal[0].count);
  // console.log(cartLocal[0].id);
  // console.log(cartLocal.length);

  for(let i=0;i<cartLocal.length;i++){
    if(value_id == cartLocal[i].id){
      cartLocal[i].count ++;
      pass = false;
    }
  }

  if(pass){
  var obj = {
        id: value_id,
        count: 1,
      };
      cartLocal.push(obj);
    }

  $('#count').html(cartLocal.length);
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal)); // เก็บตะกร้ากลับลง localStorage
}

//----------------------// // 
//var cart=[];
//funtion()
// var pass =true;
  // for(let i=0;i<cart.length;i++){
  //   if(value_id == cart[i].id){
  //     cart[i].count ++;
  //     pass = false;
  //   }
  // }
 
  // if(pass){
  //   var obj = {
  //     id: value_id,
  //     count: 1,
  //   };
  //   cart.push(obj);
  // }
  // // console.log(obj);
  // console.log(cart);