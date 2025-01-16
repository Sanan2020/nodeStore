// pro =200;

// $(document).ready(function() {
//    // $('#count').html('pass');

//     // เมื่อกดปุ่ม <a> (id = showValueButton)
//     $('#showValueButton').click(function() {
//       //  event.preventDefault();  // ป้องกันการทำงานปกติของลิงก์

//         // อ่านค่าปัจจุบันจาก localStorage
//         let count = parseInt(localStorage.getItem('count')) || 0;

//         // เพิ่มค่าทีละ 1
//         count += 1;
//         // pro+=1;
//         // เก็บค่าใหม่ใน localStorage
//         localStorage.setItem('count', count);

//         // อัปเดตค่าที่แสดงใน <div id="count">
//         $('#count').html(count);

//         // $('#pro').html(pro);
//     });

//     $('#reset').click(function(event) {
//       localStorage.clear();
//     });

//     ///cart
   
// });
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
    $('#count').html(cart.length);
  }
});

}


var cart=[];
function addtocart(value_id){
  processSwal();
  // console.log(value_id);

  var pass =true;
  for(let i=0;i<cart.length;i++){
    if(value_id == cart[i].id){
      cart[i].count ++;
      pass = false;
    }
  }
 
  if(pass){
    var obj = {
      id: value_id,
      count: 1,
    };
    cart.push(obj);
  }
  // console.log(obj);
  console.log(cart);
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || []; // อ่านตะกร้าจาก localStorage หรือเป็น array ว่าง
  cartLocal.push(cart);
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal)); // เก็บตะกร้ากลับลง localStorage
}