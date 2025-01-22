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


function addtocart(item){
  itemToOBJ = JSON.parse(item);
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];
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
  
  localStorage.setItem('cartLocal', JSON.stringify(cartLocal));
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
  cartUpdateitem();
}

function cartUpdateitem(){
  let cartLocal = JSON.parse(localStorage.getItem('cartLocal')) || [];
  if (cartLocal.length > 0) {
    let cartHTML = '';
    let sumTotal =0;
    cartLocal.forEach(function(item) {
      cartHTML += `
                   <tr>
                      <td class="tdimg"><img src="/image/ney.jpg" class="c-img"></td>
                      <td class="tdname"><div>${item.name}</div></td>
                      <td id="price1" class="hide">฿${item.price}</td>
                      <td>
                        <div class="td-qt"><input type="number" id="${item.id}" class="form-control qt" value="${item.count}" min="1" max="10" onclick="quantityCount('${item.id}','${item.price}');"></div>
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
    // alert(integer);
    sumTotal += integer;
 });
 
  $('#sumTotal').html('฿'+sumTotal);
  $('#btnSumTotal').html('฿'+sumTotal);
}