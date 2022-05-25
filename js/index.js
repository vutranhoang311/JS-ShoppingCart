import Phone from "../models/phone.js";
import { formatCash } from "./utilities.js";

let phoneList = [];
let cart = [];
const fetchPhone = async () => {
  try {
    const result = await axios({
      url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
      method: "GET",
    });
    phoneList = mapPhone(result.data);
    renderPhone(phoneList);
    renderBranch(phoneList);
  } catch (error) {
    console.log(error);
  }
};

const mapPhone = (data) => {
  return data.map((item, index) => {
    return new Phone(item);
  });
};

const renderPhone = (list) => {
  let phoneListHTML = "";
  for (let item of list) {
    phoneListHTML += item.render();
  }
  document.getElementById("products").innerHTML = phoneListHTML;
  addEventToBtnAddToCart();
};

const findPhoneByBranch = (nameBranch) => {
  let result = [];
  phoneList.forEach((item) => {
    if (item.type.toLowerCase().includes(nameBranch.toLowerCase())) {
      result.push(item);
    }
  });
  renderPhone(result);
};

const renderBranch = (phoneList) => {
  let branch = {};
  for (let item of phoneList) {
    if (!branch[item.type]) {
      branch[item.type] = item.type;
    }
  }
  let branchHTML = "<option value=''>Chọn hãng</option>";
  for (let key of Object.keys(branch)) {
    branchHTML += `<option value=${key}>${key}</option>`;
  }
  document.getElementById("selectPhone").innerHTML = branchHTML;
};

const addEventToBtnAddToCart = () => {
  const btnAddToCartElement = document.querySelectorAll(
    "button[name=addToCart]"
  );
  btnAddToCartElement.forEach((item) => {
    item.addEventListener("click", () => {
      addToCart(item.value);
    });
  });
};

const addToCart = (id) => {
  const foundPhone = phoneList.find((item) => {
    return item.id === id;
  });
  // debugger;
  if (!cart.length) {
    cart.push({ product: foundPhone, quantity: 1 });
  } else {
    let isItemCartFound = false;
    for (let item of cart) {
      if (item.product.id === foundPhone.id) {
        item.product.quantity > item.quantity
          ? item.quantity++
          : alert(`Sản phẩm không đủ số lượng`);

        isItemCartFound = true;
      }
    }
    if (!isItemCartFound) {
      cart.push({ product: foundPhone, quantity: 1 });
    }
  }
  renderCart(cart);
  saveCartToLocalStorage();
};

const renderCart = () => {
  let cartHTML = "";
  let total = 0;
  document.getElementById("tableCart").innerHTML = "";

  if (cart.length === 0) return;

  cart.forEach((item) => {
    total += item.product.price * item.quantity;
    cartHTML += `
    <tr>
        <td><img src="${item.product.img}" alt="${item.product.img}"/></td>
        <td>${item.product.name}</td>
        <td>${formatCash(item.product.price + "")}</td>
        <td>
        <button class="btn btn-secondary" type="button" value="${
          item.product.id
        }" name="btnDecrease"> - </button> 
        ${item.quantity} 
        <button class="btn btn-secondary m-1" type="button" value="${
          item.product.id
        }" name="btnIncrease"> + </button>
            </td>
            
        <td>${formatCash(item.product.price * item.quantity + "")} </td>

        <td>
        <button class="btn btn-danger m-1" type="button" value="${
          item.product.id
        }" name="btnDel"> X </button>
        </td>
    </tr>`;
  });

  if (total != 0) {
    cartHTML += `
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td><h3>Tổng tiền</h3></td>
        <td>${formatCash(total + "")}</td>
        <td><button class="btn btn-success" type="button" id="btnPayment">Thanh toán</button></td>
    </tr>`;
  }
  document.getElementById("tableCart").innerHTML = cartHTML;

  const btnIncreaseElement = document.querySelectorAll(
    "button[name=btnIncrease]"
  );
  const btnDecreaseElement = document.querySelectorAll(
    "button[name=btnDecrease]"
  );
  const btnDelElement = document.querySelectorAll("button[name=btnDel]");

  btnIncreaseElement.forEach((item) => {
    item.addEventListener("click", () => {
      increaseInCart(item.value);
    });
  });
  btnDecreaseElement.forEach((item) => {
    item.addEventListener("click", () => {
      decreaseInCart(item.value);
    });
  });
  btnDelElement.forEach((item) => {
    item.addEventListener("click", () => {
      deleteInCart(item.value);
    });
  });
  document.getElementById("btnPayment").addEventListener("click", payment);
};

const increaseInCart = (id) => {
  for (let item of cart) {
    if (item.product.id === id) {
      item.product.quantity > item.quantity
        ? item.quantity++
        : alert(`Sản phẩm có số lượng không đủ`);
    }
  }
  renderCart();
  saveCartToLocalStorage();
};
const decreaseInCart = (id) => {
  const index = cart.findIndex((item) => item.product.id === id);
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    deleteInCart(id);
  }
  saveCartToLocalStorage();
  renderCart();
};
const deleteInCart = (id) => {
  const foundIndex = cart.findIndex((item, index) => {
    if (item.product.id === id) {
      return index;
    }
  });
  if (confirm("Bạn muốn xoá sản phẩm này khỏi giỏ hàng?")) {
    cart.splice(foundIndex, 1);
    renderCart();
    saveCartToLocalStorage();
  }
};
const payment = () => {
  cart = [];
  saveCartToLocalStorage();
  document.getElementById("tableCart").innerHTML = "";
};
const saveCartToLocalStorage = () => {
  localStorage.setItem("phoneCart", JSON.stringify(cart));
};
const getCartFromLocalStorage = () => {
  const cartFromtLocal = JSON.parse(localStorage.getItem("phoneCart"));
  if (cartFromtLocal) return cartFromtLocal;
};

fetchPhone();
const selectPhoneEl = document.getElementById("selectPhone");
selectPhoneEl.addEventListener("change", () => {
  findPhoneByBranch(selectPhoneEl.value);
});

getCartFromLocalStorage() ? (cart = getCartFromLocalStorage()) : (cart = []);
renderCart();
