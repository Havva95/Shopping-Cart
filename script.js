let productData = [];  
let cartData = [];  

//DOM Elements
let productList = document.querySelector(".productList");  
let appCartTrigger = document.querySelector(".appCartTrigger");  
let appCart = document.querySelector(".appCart");  
let closeCart = document.querySelector(".closeCart");  
let cartList = document.querySelector(".cartList");  
let cartCountBadge = document.querySelector(".cartCountBadge");  
let cartTotal = document.querySelector(".cartTotal span");
let clearCart = document.querySelector(".clearCart");
let checkOut = document.querySelector(".checkout");
  
//Lets get product data  
  
async function fetchData() {  
  let response = await fetch("./data.json");  
  let data = await response.json();  
  return data;  
}  
  
fetchData().then((data) => {  
  productData = [...data];  
  populateProducts(productData);  
});  
  
function populateProducts(data) {  
  let productsHTML = data  
    .map((item) => {  
      return `  
<div class="productItem">  
    <div class="productPic">  
    <img src="./assets/${item.image}" alt="">  
  </div>  
  <div class="productTitle">  
       <h2>${item.title}</h2>  
  </div>  
  <div class="productMeta">  
    <div class="productInfo">                 
      <h4>$ ${item.price}</h4>  
    </div>  
    <div class="addToCart" data-id=${item.id}>  
      <img src="./assets/add.svg" alt="">  
    </div>  
  </div>  
</div>  
    `;  
    })  
    .join("");  
  productList.innerHTML = productsHTML;  
}  
  
//Add to cart fucntion  
productList.addEventListener("click", addToCart);  
  
function addToCart(e) {  
  if (e.target.classList.contains("addToCart")) {  
    //when you click on product add to cart button idetify the product form productData then add it to the cartData  
  
    let id = e.target.dataset.id;  
    let selectedProduct = productData.find(function (item) {  
      return item.id === id;  
    });  
    let selectedProductIndex = cartData.findIndex(function (item) {  
      return item.id === id;  
    });  
  
    if (selectedProductIndex === -1) {  
      selectedProduct.count = 1;  
      cartData.push(selectedProduct);  
    } else {  
      cartData[selectedProductIndex].count++;  
    }  
  
    populateCart(cartData);  
    handleBadgeCount(cartData);  
    updateTotal(cartData);
    console.log(cartData);  
  }  
}  
  
function populateCart(data) {  
  let html;  
  html = data  
    .map(function (cartItem) {  
      return `  
    <div class="cartItem" data-id=${cartItem.id}>  
                    <div class="cartItemPic">  
                        <img src="./assets/${cartItem.image}" alt="">  
                    </div>  
                    <div class="cartItemInfo">  
                        <h3>${cartItem.title}</h3>  
                        <h4>$ ${cartItem.price}</h4>  
                    </div>                      
                    <input type="number" value=${cartItem.count} class="cartItemCount" name="cartItemCount" id="">  
                    <button class="cartRemoveItem" >  
                        <img src="./assets/trash.svg" alt="">  
                    </button>  
                </div>  
    `;  
    })  
    .join("");  
  cartList.innerHTML = html;  
}  

// Handling the badge count

function handleBadgeCount(data) {  
  let total = data.reduce((acc, curr) => {  
    return acc + curr.count;  
  }, 0);  
  cartCountBadge.innerText = total;  
} 

//removing one product from cart

cartList.addEventListener("click", removeItemFromCart);

function removeItemFromCart(e){
    if(e.target.classList.contains("cartRemoveItem")){
        let id = e.target.parentElement.dataset.id;
        console.log(id);
        let productIndex = cartData.findIndex(function(item){
            return item.id === id;
        })

        //remove product from cartdata array
        cartData.splice(productIndex,1);
        populateCart(cartData);
        handleBadgeCount(cartData);
        updateTotal(cartData);
    }
}

//handle product count change

cartList.addEventListener("change",updateCartItemCount);

function updateCartItemCount(e){
    if(e.target.classList.contains("cartItemCount")){
        let id = e.target.parentElement.dataset.id;
        let updatedCount =parseInt(e.target.value) ;
        let productIndex = cartData.findIndex(function(item){
            return item.id === id;
        })
        cartData[productIndex].count =Math.max(updatedCount,1);
        console.log(cartData);
        populateCart(cartData);
        handleBadgeCount(cartData);
        updateTotal(cartData);
    }
}

//Update the total price

function updateTotal(data){
    let totalCost = data.reduce(function(acc,curr){
        return acc + curr.count * curr.price;
    },0)
    cartTotal.innerText = totalCost;
}


//Clearing Cart Items

clearCart.addEventListener("click", clearCartItems);

function clearCartItems(){
    cartData = [];
    cartList.innerHTML = "";
    cartTotal.innerText = "";
    countBadge.innerText = 0;

    

}


// Checking out from the cart

checkOut.addEventListener("click", handleCheckOut);

function handleCheckOut(){
    if(cartData.length === 0){
        alert("Please add products to the cart")
    }else{
        alert("You are redirected to the page")
    }
}
  
//Show cart  
appCartTrigger.addEventListener("click", function () {  
  appCart.classList.add("active");  
  console.log("clicked");  
});  

//Close cart
  
closeCart.addEventListener("click", function () {  
  appCart.classList.remove("active");  
});