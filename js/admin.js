import Phone from "../models/phone.js";
import { formatCash } from "./utilities.js";
let phoneList = [];
const fetchPhoneData = async () => {
  try {
    const result = await axios({
      url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
      method: "GET",
    });
    phoneList = mapPhone(result.data);
    renderPhone(phoneList);
  } catch (error) {
    console.log(error);
  }
};

const mapPhone = (data) => {
  return data.map((item) => {
    return new Phone(item);
  });
};

const renderPhone = (data) => {
  let dataHTML = "";
  data.forEach(
    (item) =>
      (dataHTML += `
  <tr>
    <td class="nowrap">
        <span class="mr-1">${item.id}</span>
    </td>
    <td>${item.name}</td>
    <td>${item.screen}</td>
    <td>${item.backCamera}</td>
    <td>${item.frontCamera}</td>
    <td>${formatCash(item.price + "")}</td>
    <td>${item.type}</td>
    <td>${item.quantity}</td>
    <td> 
    <button id="btnUpdate" value=${
      item.id
    } type="button" class="m-1 btn btn-success" data-bs-toggle="modal" data-bs-target="#phoneModal">CẬP NHẬT</button>
    <button id="btnDelete" value=${
      item.id
    } type="button" class="btn btn-danger" onclick="">XOÁ</button>
        </td>
</tr>
  `)
  );
  document.getElementById("tableDanhSach").innerHTML = dataHTML;

  document.querySelectorAll("#btnUpdate").forEach((item) =>
    item.addEventListener("click", () => {
      renderBranch(phoneList);
      getUpdateProduct(item.value);
    })
  );

  document.querySelectorAll("#btnDelete").forEach((item) =>
    item.addEventListener("click", () => {
      removeProduct(item.value);
    })
  );
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
  document.getElementById("branch").innerHTML = branchHTML;
};

const addNewPhone = async () => {
  if (!checkValid()) return;
  const newPhone = new Phone({
    name: document.getElementById("phoneName").value,
    backCamera: document.getElementById("backCamera").value,
    frontCamera: document.getElementById("frontCamera").value,
    price: document.getElementById("price").value,
    screen: document.getElementById("screen").value,
    img: document.getElementById("image").value,
    desc: document.getElementById("desc").value,
    type: document.getElementById("branch").value,
    quantity: document.getElementById("quantity").value,
  });
  try {
    await axios({
      url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
      method: "POST",
      data: newPhone,
    });
    document.getElementById("btnCloseModal").click();
    document.getElementById("btnResetModal").click();
    fetchPhoneData();
  } catch (error) {
    console.log(error);
  }
};

const removeProduct = async (id) => {
  const product = findProductById(id);
  if (!product) return alert("Không tồn tại sản phẩm này");
  if (confirm(`Bạn muốn xoá sản phẩm ${product.name} ?`)) {
    try {
      await axios({
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method: "DELETE",
      });
      fetchPhoneData();
    } catch (error) {
      console.log(error);
    }
  }
};

const updateProduct = async (id) => {
  const foundProduct = findProductById(id);
  if (!foundProduct) return alert("Sản phẩm không tồn tại");
  if (!checkValid()) return;
  const updatedPhone = new Phone({
    name: document.getElementById("phoneName").value,
    backCamera: document.getElementById("backCamera").value,
    frontCamera: document.getElementById("frontCamera").value,
    price: document.getElementById("price").value,
    screen: document.getElementById("screen").value,
    img: document.getElementById("image").value,
    desc: document.getElementById("desc").value,
    type: document.getElementById("branch").value,
    quantity: document.getElementById("quantity").value,
  });

  try {
    await axios({
      url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
      method: "PUT",
      data: updatedPhone,
    });
    document.getElementById("btnResetModal").click();
    document.getElementById("btnCloseModal").click();
  } catch (err) {
    console.log(err);
  }
  fetchPhoneData();
};

const searchProduct = (value) => {
  renderPhone(
    phoneList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase().trim())
    )
  );
};

const getUpdateProduct = (id) => {
  clearSpanValid();
  const foundProduct = findProductById(id);
  if (!foundProduct) return alert("Sản phẩm không tồn tại");
  document.getElementById("phoneName").value = foundProduct.name;
  document.getElementById("backCamera").value = foundProduct.backCamera;
  document.getElementById("frontCamera").value = foundProduct.frontCamera;
  document.getElementById("price").value = foundProduct.price;
  document.getElementById("screen").value = foundProduct.screen;
  document.getElementById("image").value = foundProduct.img;
  document.getElementById("desc").value = foundProduct.desc;
  document.getElementById("branch").value = foundProduct.type;
  document.getElementById("quantity").value = foundProduct.quantity;
  document.getElementById("btnAddProduct").disabled = true;
  if (!document.getElementById("btnSaveProduct")) {
    const btnSave = document.createElement("button");
    btnSave.id = "btnSaveProduct";
    btnSave.innerHTML = "Lưu sản phẩm";
    btnSave.className = "btn btn-primary";
    document.querySelector(".modal-footer").appendChild(btnSave);
    btnSave.addEventListener("click", () => updateProduct(foundProduct.id));
  } else {
    document.getElementById("btnSaveProduct").remove();
    const btnSave = document.createElement("button");
    btnSave.id = "btnSaveProduct";
    btnSave.innerHTML = "Lưu sản phẩm";
    btnSave.className = "btn btn-primary";
    document.querySelector(".modal-footer").appendChild(btnSave);
    btnSave.addEventListener("click", () => updateProduct(foundProduct.id));
  }
};

const findProductById = (id) => {
  return phoneList.find((item) => {
    return item.id === id + "";
  });
};

const checkValid = () => {
  let isValid = true;

  isValid &=
    require("phoneName", "spanPhoneName") &&
    checkLength("phoneName", "spanPhoneName") &&
    checkPattern(
      /^[A-z0-9\s]+$/g,
      "phoneName",
      "spanPhoneName",
      "* Không nhập ký tự đặc biệt"
    );
  isValid &=
    require("price", "spanPrice") && checkNum("price", "spanPrice", 100000);

  isValid &= require("screen", "spanScreen");

  isValid &= require("backCamera", "spanBackCamera");

  isValid &= require("frontCamera", "frontCamera");

  isValid &= require("image", "spanImage");

  isValid &= require("branch", "spanBranch");

  isValid &=
    require("quantity", "spanQuantity") &&
    checkNum("quantity", "spanQuantity", 1);

  return isValid;
};

const require = (inputId, spanId) => {
  const inputValue = document.getElementById(inputId).value;
  if (inputValue) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(
    spanId
  ).innerHTML = `* Trường này không được để trống `;

  return false;
};

const checkLength = (inputId, spanId, maxLength = 40, minLength = 4) => {
  const inputValue = document.getElementById(inputId).value.split("");
  if (inputValue.length > maxLength || inputValue.length < minLength) {
    document.getElementById(
      spanId
    ).innerHTML = `* Nhập độ dài từ ${minLength} đến ${maxLength} ký tự`;
    return false;
  }
  document.getElementById(spanId).innerHTML = ``;
  return true;
};

const checkPattern = (regex, inputId, spanId, errorMessage) => {
  const inputValue = document.getElementById(inputId).value;
  const valid = regex.test(inputValue);
  if (!valid) {
    document.getElementById(spanId).innerHTML = errorMessage;
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  document.getElementById(spanId).style.display = "none";
  return true;
};

const checkNum = (inputId, spanId, minPrice) => {
  const inputValue = +document.getElementById(inputId).value;
  if (inputValue < minPrice) {
    document.getElementById(
      spanId
    ).innerHTML = `* Giá trị nhỏ nhất là ${formatCash(minPrice + "")}`;
    return false;
  }
  return true;
};

const clearSpanValid = () => {
  const span = document.querySelectorAll(".sp-thongbao");
  span.forEach((item) => {
    item.innerHTML = "";
  });
};
fetchPhoneData();
document
  .getElementById("btnShowInputPhoneModal")
  .addEventListener("click", () => {
    renderBranch(phoneList);
    document.getElementById("btnResetModal").click();
    clearSpanValid();
    if (document.getElementById("btnSaveProduct"))
      document.getElementById("btnAddProduct").disabled = false;
    document.getElementById("btnSaveProduct").remove();
  });

document.getElementById("btnAddProduct").addEventListener("click", addNewPhone);

const searchElement = document.getElementById("inputSearch");
searchElement.addEventListener("input", () =>
  searchProduct(searchElement.value)
);

