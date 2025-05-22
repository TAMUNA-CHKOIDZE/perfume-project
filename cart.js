document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartItemsContainer");
  if (!cartContainer) return; //თუ ეს გვერდი არაა cart-ის გადავდივართ

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>კალათა ცარიელია 😔</p>";
  } else {
    cart.forEach((item) => {
      const productEl = document.createElement("div");
      productEl.classList.add("cart-item");
      productEl.innerHTML = `
        <div class="plus_minus_box">
          <button class="plus_btn">+</button>
          <span class="quantity">1</span>
          <button class="minus_btn">-</button>
        </div>
        <img src="${item.image}" width="80" />
        <h3>${item.name}</h3>
        <p class="price" data-base-price="${item.price}">${item.price}</p>
        <button class="delete_btn">delete</button>
      `;
      cartContainer.appendChild(productEl);
    });
  }

  // Event delegation მჭირდება ანუ რმე უნდა დავაკლიკო მშობელს, რომელიც უკვე არსებობს. შვილს DOM-ში ვქმნი და კლიკისას ვერ აღიქვამს

  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("plus_btn")) {
      const quantitySpan = e.target.parentElement.querySelector(".quantity");
      let current = parseInt(quantitySpan.textContent) || 1;
      current += 1;
      quantitySpan.textContent = current;

      const priceEl = e.target.closest(".cart-item").querySelector(".price");
      const basePrice = parseFloat(
        priceEl.dataset.basePrice.replace(/[^\d.]/g, "")
      );
      priceEl.textContent = (basePrice * current).toFixed(2) + " $";
    }

    if (e.target.classList.contains("minus_btn")) {
      const quantitySpan = e.target.parentElement.querySelector(".quantity");
      let current = parseInt(quantitySpan.textContent) || 1;

      const productEl = e.target.closest(".cart-item");
      const priceEl = productEl.querySelector(".price");
      const basePrice = parseFloat(
        priceEl.dataset.basePrice.replace(/[^\d.]/g, "")
      );

      if (current > 1) {
        current -= 1;
        quantitySpan.textContent = current;
        priceEl.textContent = (basePrice * current).toFixed(2) + " ₾";
      } else {
        // წაშალე HTML-დან
        productEl.remove();

        // წაშალე localStorage-იდან
        const productName = productEl.querySelector("h3").textContent;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter((item) => item.name !== productName);
        localStorage.setItem("cart", JSON.stringify(cart));

        // თუ კალათა ცარიელია — გამოაჩინე ცარიელი შეტყობინება
        if (cart.length === 0) {
          cartContainer.innerHTML = "<p>კალათა ცარიელია 😔</p>";
        }
      }
    }

    // წაშლის ღილაკზე კლიკისას card უნდა წაიშალოს ვიზუალურადაც და localStorage-დანც
    if (e.target.classList.contains("delete_btn")) {
      const deleteButton = e.target.parentElement.querySelector(".delete_btn");
      const productEl = e.target.closest(".cart-item");
      // წაშალე HTML-დან
      productEl.remove();

      // წაშალე localStorage-იდან
      const productName = productEl.querySelector("h3").textContent;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((item) => item.name !== productName);
      localStorage.setItem("cart", JSON.stringify(cart));

      // თუ კალათა ცარიელია — გამოაჩინე ცარიელი შეტყობინება
      if (cart.length === 0) {
        cartContainer.innerHTML = "<p>კალათა ცარიელია 😔</p>";
      }
    }
  });
});



// ფასის დაჯამება დამრჩა ბოლოს