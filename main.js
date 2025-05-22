const cardContainer = document.getElementById("cardContainer");
const paginationContainer = document.getElementById("paginationContainer");
// მიმდინარე გვერდის ნომერი
let currentPage = 1;
// თითოეულ გვერდზე რამდენი ელემენტიც უნდა გამოჩნდეც აღვწერ rows ცვლადში
const rows = 8;

// showSkeletons
function showSkeletons(container, count) {
  container.innerHTML = ""; // გასუფთავება
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-card");

    skeleton.innerHTML = `
      <div class="skeleton-img"></div>  <!-- სურათის ადგილი -->
      <div class="skeleton-text" style="width: 80%;"></div>  <!-- სათაურის ადგილი -->
      <div class="skeleton-price"></div> <!-- ფასი -->
    `;

    container.appendChild(skeleton);
  }
}

// showSkeletons ფუნქციის გამოძახება
showSkeletons(cardContainer, rows);

// displayList ფუნქცია აჩვენებს ერთი ანუ პირველი გვერდის card-ებს
const displayList = function (
  cardItmesArray,
  cardContainer,
  rows,
  currentPage
) {
  // გასუფთავება მჭირდება cardContainer-ის მაშინ, როცა ღილაკზე დავაკლიკებ, რათა არსებული გვერდის კონტენტი წაიშალოს და მის ნაცვლად ახალი 6 ბარათი დაემატოს
  cardContainer.innerHTML = "";
  currentPage--; // თავიდან 0-დან 6-ის ჩათვლით რომ ამოჭრას
  const start = rows * currentPage;
  const end = start + rows;
  //   slice-ით მასივიდან ამოვჭრი ექვს ბარათს
  const cutCurdsArray = cardItmesArray.slice(start, end);

  //   slice დააბრუნებს ამოჭრილი ბარათების მასივს, რომელსაც გადავუვლი forEach-ით და შევქმნი იმდენ card-ს რამდენი ელემენტიცაა მასივში. index-იც მჭირდება და ამიტომ ვიყენებ forEach-ს
  cutCurdsArray.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-img-box">
      <img src="${item.image_link}" alt="${item.name}" class="product-img" />
      </div>
      <div class="product-text-content">
        <h3 class="product-title">${item.name}</h3>
      <div class="product-footer">
      <p class="product-price">${
        item.price ? "$" + item.price : "The price is not available"
      }</p>
      <button class="add-to-cart-btn" data-id="${item.id}">ADD</button>
       </div>
      </div>
    `;

    // ინდექსის მიხედვით თანმიმდევრულად 1 წამის შუალედით animation delay
    card.style.animation = `fadeInUp 0.5s ease forwards`;
    card.style.animationDelay = `${index * 100}ms`;

    cardContainer.appendChild(card);
  });
};

// სერვერიდან მოსული პროდუქტების დატა
fetch("https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline")
  .then(function (response) {
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(`Server error ${response.status}: ${text}`);
      });
    }
    return response.json();
  })
  .then(function (cardItemsArray) {
    // ვამატებ ხელოვნურ დაყოვნებას UX-ის გასაუმჯობესებლად
    setTimeout(() => {
      displayList(cardItemsArray, cardContainer, rows, currentPage);
      paginationBtns(cardItemsArray, paginationContainer, rows);
    }, 500); // 500ms
  })
  .catch(function (error) {
    let errorText = document.createElement("span");
    errorText.style.color = "red";
    errorText.textContent = `Error: ${error.message}`;
    container.appendChild(errorText);
  });

// paginationBtns ფუნქციით შევქმნი იმდენ ღილაკს, რამდენი გვერდიცაა და თითოეულზე კლიკის დროს გაეშვება displayList ფუნქცია, რომ ახალ-ახალი ბარათები გამოაჩინოს, ძველი კი გააქროს
const paginationBtns = function (cardItmesArray, paginationContainer, rows) {
  // paginationContainer.innerHTML = ""; იმიტომ მჭირდება, რომ თავიდან ავიცილო დუბლირებული pagination ღილაკები ყოველ ჯერზე როცა paginationBtns() ფუნქციას ვიძახებ. და ყოველ ჯერზე ხელახლა აგენერირებ paginationBtns()-ს (მაგალითად, ახალი გვერდი ავირჩიე), მაშინ ახალი ღილაკები ძველების ზემოდან დაემატება, ანუ container-ში დამიგროვდება
  paginationContainer.innerHTML = "";
  // გვერდების რაოდენობას ვიგებ იმით, რომ მასივის სიგრძეს გავყოფ თითოეულ გვერდზე გამოსაჩენ ბარათების რაოდენობაზე და თან დავამრგვალებ
  const pageCount = Math.ceil(cardItmesArray.length / rows); // 5 გვერდია

  for (let i = 1; i <= pageCount; i++) {
    // შეიქმენა იმდენი ღილაკი რამდენი გვერდიცაა
    const paginationButton = document.createElement("button");
    paginationButton.classList.add("paginationButton");
    // ღილაკის ტექსტი გახდება ის, რასაც i აბრუნებს 1-დან 5-ის ჩათვლით
    paginationButton.textContent = i;
    // თუ მიმდინარე გვერდის რიცხვი დაემთხვევა i-ს რიცხვს, მაშინ ღილაკი არის აქტიური და მიენიჭოს ფერი თან თავიდანვე რომ ჰქონდეს პირველ ღილაკს მწვანე ფერი, კლიკამდე
    if (currentPage === i) {
      paginationButton.classList.add("active");
    }
    // საბოლოოდ ღილაკებს ჩავსვამ paginationContainer-ში
    paginationContainer.appendChild(paginationButton);

    // ღილაკზე კლიკისას უნდა ვუთხრა, რომ მიმდინარე გვერდის მნიშვნელობა გახდეს i-ს მნიშვნელობა ანუ თუ დავაკლიკებ მეორე ღილაკს currentPage გახდება 2 და მომდევნო 6 ბარათი ამოიჭრება და გამოჩნდება displayList ფუნქციის გამოძახებით
    paginationButton.addEventListener("click", () => {
      currentPage = i;
      displayList(cardItmesArray, cardContainer, rows, currentPage);

      // current_btn-ში შეინახება paginationContainer-ში არსებული ის ღილაკი, რომლის კლასიც არის active. document..querySelector("button.active");-ს დავწერდი თუ paginationContainer-ს მნიშვნელობა არ აქვს
      const activeButton = paginationContainer.querySelector("button.active");
      // if (current_btn) ამოწმებს, არსებობს თუ არა current_btn. ანუ თუ არსებობს ღილაკი, რომელსაც აქვს active, მაშინ წავუშლი ამ კლასს. ამას თუ არ დავუწერ, მაშინ როცა ჯერ არცერთი ღილაკი არ არის აქტიური, null-ს დააბრუნებს და მაშინ null.classList.remove(...) → შეცდომას გამოიწვევს.
      //   ეს ჩანაწერი არ მოითხოვს else ბლოკს, რადგან ორივე უნდა შესრულდეს: current_btn.classList.remove("active");-ც და paginationButton.classList.add("active");-ც. თუ current_btn არსებობს, მაშინ წაშალე მასზე active კლასი. და თან ყოველთვის დაამატე active კლასი იმ ღილაკზე, რომელსაც დააკლიკე (paginationButton).
      if (activeButton) activeButton.classList.remove("active");
      paginationButton.classList.add("active");
      //   console.log(paginationContainer.querySelector("button.active"));
    });
  }
};

// ეს კოდი კონსოლში ან აქ ჩაწერილი გამისუფთავებს localStorage-ში ჩაწერილ ბარათებს და კალათაში ძველი ვერსიები აღარ დამხვდება, თუმცა მე თვითონ უნდა გავაკეთო ეგ გასუფთავება
// localStorage.removeItem("cart");

document.querySelector(".fa-cart-shopping").addEventListener("click", () => {
  window.location.href = "cart.html";
});

document.addEventListener("click", function (e) {
  // ეს დაიჭერს ყველა კლიკს
  //   // console.log("დაკლიკებულია:", e.target);

  //   // მაგრამ აქ უკვე ვფილტრავთ — გვინდა მხოლოდ ის ღილაკი, რომელსაც აქვს add-to-cart-btn კლასი
  //   // ამით ამოვიცნობ რაზე მოხდა კლიკი, ნამდვილად add-to-cart-btn-ზე მოხდა თუ არა
  if (e.target.classList.contains("add-to-cart-btn")) {
    const card = e.target.closest(".product-card");

    const product = {
      id: e.target.dataset.id, // აქ უნდა ველოდოთ, რომ სწორი id მივიღოთ
      name: card.querySelector("h3").textContent,
      price: card.querySelector("p").textContent,
      image: card.querySelector("img").src,
    };

    const productAdded = addToCart(product); //  ფუნქცია, რომელიც მხოლოდ კონკრეტულ პროდუქციას ამატებს კალათაში

    if (productAdded) {
      alert("The product has been added to the cart ✅");
      // თუ პროდუქტი დაემატება კალათაში, მაშინ კალათის რიცხვიც უნდა დააფდეითდეს
      updateCartCount();
    } else {
      alert("This product has already been added to your cart!");
    }
  }
});

// localStorage-დან უნდა ამოვიღო შენახული მონაცემები, რომელიც cart-ში ვარდება და countSpan-ში უნდა ჩაიწეროს ის რიცხვი, რა სიგრძისაცაა cart ანუ არჩეული პროდუქტის რაოდენობა
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countSpan = document.querySelector(".cart_btn_result");
  countSpan.textContent = cart.length;
}

// კალათაში დამატება
function addToCart(product) {
  // წამოიღე არსებული კალათა, ან შექმენი ცარიელი
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // შეამოწმე, თუ პროდუქტი უკვე არსებობს კალათაში
  const productExists = cart.some((item) => item.id === product.id);

  if (!productExists) {
    // თუ პროდუქტი არ არის კალათაში, დაამატეთ
    cart.push(product);

    // დააბრუნე localStorage-ში
    localStorage.setItem("cart", JSON.stringify(cart));

    return true; // მინიშნება, რომ პროდუქტი დამატებულია
  }

  return false; // მინიშნება, რომ პროდუქტი უკვე არსებობს კალათაში
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});
