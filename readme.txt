Yêu cầu: 

Phần 1:  Tạo 1 website bán hàng với các chức năng sau đây

 0. Xây dựng lớp đối tượng Product.(Check Api xem backend trả về product như thế nào)

 1.Hiển thị danh sách sản phẩm cho khách hàng, Gợi Ý:tạo một mảng ProductList ngoài global, call axios lấy danh sách sản phẩm từ database,gán mảng sản phẩm trả về vào biến ProductList, viết hàm tạo giao diện. (api lấy danh sách sản phẩm nằm dưới cùng). Hàm tạo giao diện giống y chang hàm tạo bảng, chỉ khác thay vì tạo <tr></tr> thì giờ tạo cái <div> cho từng sản phẩm

   2.tạo một ô select cho phép người dùng filter theo loại sản phẩm, ô select có 2 option là samsung và iphone, viết hàm gắn vào sự kiện onChange của select

Gợi ý: dựa vào thuộc tính Type của đối tượng sản phẩm, có 2 loại: samsung hoặc iphone. ví dụ: nếu người dùng chon samsung, tiến hành duyệt vòng for, lọc ra các sản phẩm có type === "samsung",bỏ vào 1 mảng , sau đó gọi hàm tạo giao diện động dựa theo mảng vừa tìm được

   3.Cho phép người dùng chọn sản phẩm bỏ vào giỏ hàng

 (gợi ý: - tạo một mảng giỏ hàng ngoài global, khi người dùng click nút ADD TO CART, tiến hành truyền vào id, tìm sản phẩm trong ProductList, ví dụ tìm được index  = 2, thì push nguyên đối tượng ProductList[2] vào mảng giỏ hàng)

   4.Không push sản phẩm mình chọn vào cart vì không có số lượng , tạo một đối tượng mới có đinh dang sau rồi push vào mảng cart {product: {đối tượng sản phẩm cần push}, quantity: 'bla bla'}  .Vd : var cartItem = {product: {id: 1, price: 10, name : 'samsung a10' }, quantity: 1}

   5. Khi push vào kiểm tra xem, nếu sản phẩm chưa có trong giỏ hàng thì push mới vào với quantity là 1, nếu có rồi ko push nữa mà chỉ tăng quantity lên 1

   5.1 In giỏ hàng ra màn hình, viết hàm renderCart, duyệt mảng giỏ hàng có bao nhiêu sản phẩm thì tạo ra bấy nhiêu <tr> tương ứng.

  6. Trong giao diện giỏ hàng, cho phép người dùng chỉnh sửa số lượng (gợi ý: cho 2 nút tăng giảm), viết hàm gắn voà 2 nút đó, khi nhấn vào thì truyền vào id, tìm trong mảng giỏ hàng xem sản phẩm đó nằm ở đâu, lấy quantity ra tăng hoặc giảm , sau đó render lại giao diện

  7. In ra tổng tiền ra giao diện. Trong hàm renderCart, tính tổng giá tiền của tất cả sản phẩm và hiện ra (giá tiền * số lượng)

  8. Người dùng nhấn nút thanh toán, clear giỏ hàng, set mảng giỏ hàng về []

  9. Lưu giỏ hàng vào localstorage , lần sau khi vào trang sẽ load lên lại

  10. Cho phép người dùng remove sản phẩm ra khỏi giỏ hàng, giống như xoá nhân viên

Phần 2: (tạo 1 source code riêng để làm) Phần quản trị

1.Thực hiện các chức năng : thêm xoá sửa sản phẩm (tương tự thêm xoá sửa nhân viên với các api dưới)

API products:

 - GET https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products : lấy danh sách products

 - GET https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id} : lấy thông tin 1 product theo id

   VD: product có id là 123 => api là:  https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/123 .Ở dưới cũng tương tự nha

 - POST https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products: Thêm product

 - PUT https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id} : cập nhật product theo id

 - DELETE https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id} : Xoá product theo id