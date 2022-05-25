import { formatCash } from "../js/utilities.js";
export default class Phone {
  constructor(data) {
    Object.assign(this, data);
  }
  render() {
    return `
    <div class="col col-lg-3
    mb-3">
      <div class="item h-100">
          <div class="card h-100">
              <img class="abc" src="${this.img}" class="card-img-top" alt=${
      this.img
    }>
              <div class="card-body">
                  <h5 class="card-title">${this.name}</h5>
                  <p class="card-text">Giá: ${formatCash(
                    this.price + ""
                  )}</p>          
                  <p class="card-text">Màn hình: ${this.screen}</p>
                  <p class="card-text">Camera sau: ${this.backCamera}</p>
                  <p class="card-text">Camera trước${this.frontCamera}</p>
                  <p class="card-text">${this.desc}</p>
                  <p class="card-text">Số lượng: ${this.quantity}</p>

                  <button type="button" id="btnAddToCart" name="addToCart" value="${
                    this.id
                  }" class="btn btn-primary">Add to cart</button>
              </div>
          </div>
      </div>
  </div>`;
  }
}
