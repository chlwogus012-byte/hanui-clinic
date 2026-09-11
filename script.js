document.addEventListener("DOMContentLoaded", function () {
  var promoOverlay = document.getElementById("promoOverlay");
  var promoClose = document.getElementById("promoClose");
  var promoHideToday = document.getElementById("promoHideToday");
  var PROMO_KEY = "ondamPromoHiddenUntil";

  function closePromo() {
    promoOverlay.classList.remove("active");
    if (promoHideToday.checked) {
      localStorage.setItem(PROMO_KEY, new Date().toDateString());
    }
  }

  if (localStorage.getItem(PROMO_KEY) !== new Date().toDateString()) {
    setTimeout(function () {
      promoOverlay.classList.add("active");
    }, 400);
  }

  promoClose.addEventListener("click", closePromo);
  promoOverlay.addEventListener("click", function (e) {
    if (e.target === promoOverlay) closePromo();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && promoOverlay.classList.contains("active")) closePromo();
  });

  var menuToggle = document.getElementById("menuToggle");
  var gnb = document.getElementById("gnb");

  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("active");
    gnb.classList.toggle("active");
  });

  var gnbLinks = gnb.querySelectorAll("a");
  gnbLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("active");
      gnb.classList.remove("active");
    });
  });

  var header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = "0 4px 20px rgba(15, 61, 153, 0.08)";
    } else {
      header.style.boxShadow = "none";
    }
  });
});
