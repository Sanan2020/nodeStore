var data;
$(document).ready(function() {
  cartUpdateitem();
});

function processSwal(label){
  let timerInterval;
  Swal.fire({
    icon:'success',
    timer: 1000,
    showConfirmButton: false,
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
      $('#count').html(label);
    }
  });
}

async function addtocart(item){
  let response = await fetch("/sessionAddtoCart", { credentials: "include" }); // ⬅️ ส่ง cookies ไปด้วย
  let data = await response.json();
  if (data.loggedIn) {
    console.log("✅ ผู้ใช้ล็อกอินแล้ว:", data.customerId);

  itemToOBJ = JSON.parse(item);
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];
  var pass =true;

  for(let i=0;i<cartLocal.length;i++){
    if(itemToOBJ._id == cartLocal[i].id){
      cartLocal[i].count ++;
      pass = false;
    }
  }

  console.log(itemToOBJ);
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
  
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal));
  processSwal(cartLocal.length);
  }else{
    Swal.fire({
      title: "คุณยังไม่ได้ล็อกอิน",
      text: "กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าในตะกร้า",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ล็อกอิน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
  }
}

//cart remove item
function cartRemoveitem(removeId){
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];
  cartLocal = cartLocal.filter(function(item) {
    return item.id !== removeId;
  });
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal));
  cartUpdateitem();
}

async function cartUpdateitem(){
  let cartLocal = await JSON.parse(localStorage.getItem('cartLocal')) || [];
  if (cartLocal.length > 0) {
    let cartHTML = '';
    let sumTotal =0;

     cartHTML = `
        <tr>
            <th colspan="2">สินค้า.</th>
            <th>ราคา</th>
            <th>จำนวน</th>
            <th>รวม</th>
            <th></th>
        </tr>
    `;

    await cartLocal.forEach(function(item) {
      cartHTML += `
                   <tr>
                      <td class="tdimg"><img src="/image/${item.image}" class="c-img"></td>
                      <td class="tdname"><div>${item.name}</div></td>
                      <td style="text-align: center;" id="price1" class="hide">฿${item.price}</td>
                      <td class="td-qt">
                        <input type="number" id="${item.id}" class="form-control qt" value="${item.count}" min="1" max="10" onclick="quantityCount('${item.id}','${item.price}');">
                      </td>
                      <td class="tdtotal" id="total${item.id}">฿${item.price * item.count}</td>
                      <td class="tdrm"><a class="btn btn-danger btn-rm" onclick="cartRemoveitem('${item.id}');">X</a></td>
                    </tr>
                    `;
      sumTotal += (item.price * item.count);
    });
    $("#NotcartItems").css('display','none');
    $("#cartItems").html(cartHTML);
    $('#count').html(cartLocal.length);
    //sumTotal
    $('#sumTotal').html('฿'+sumTotal);
    $('#btnSumTotal').html('฿'+sumTotal);
    $('#sumList').html(cartLocal.length);
    } else {
      $("#tbn").css('display','none');
      $("#NotcartItems").css('display','flex');
      $('#count').html('0');
    }
}

//quantitycount
function quantityCount(countId, price){
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];

  //+ -
  let quantity = $('#'+countId).val();
  //update cartLocal.count
  for(let i=0;i<cartLocal.length;i++){
    if(countId == cartLocal[i].id){
      cartLocal[i].count = quantity;
    }
  }
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal));
  //update total-price
  $('#total'+countId).html('฿'+  price*quantity);

  //sumTotal
  let sumTotal =0;
  var text = $('.tdtotal').text();
  $('.tdtotal').each(function() {
    var text = $(this).text().replace('฿', '').trim();
    var integer = parseInt(text, 10);
    sumTotal += integer;
  });
 
  $('#sumTotal').html('฿'+sumTotal);
  $('#btnSumTotal').html('฿'+sumTotal);
}