document.addEventListener("DOMContentLoaded", function () {
  var promoOverlay = document.getElementById("promoOverlay");

  if (promoOverlay) {
    initPromo(promoOverlay);
  }

  var columnGrid = document.getElementById("columnGrid");
  if (columnGrid) {
    initColumnGrid(columnGrid);
  }

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

function initPromo(promoOverlay) {
  var promoClose = document.getElementById("promoClose");
  var promoHideToday = document.getElementById("promoHideToday");
  var PROMO_KEY = "ondamPromoHiddenUntil";

  function closePromo() {
    promoOverlay.classList.remove("active");
    if (promoHideToday.checked) {
      localStorage.setItem(PROMO_KEY, new Date().toDateString());
    }
  }

  promoClose.addEventListener("click", closePromo);
  promoOverlay.addEventListener("click", function (e) {
    if (e.target === promoOverlay) closePromo();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && promoOverlay.classList.contains("active")) closePromo();
  });

  fetch("data/promo.json")
    .then(function (res) { return res.json(); })
    .then(function (promo) {
      if (!promo.enabled) return;

      document.getElementById("promoHeading").innerHTML = escapeHtml(promo.heading).replace(/\n/g, "<br>");
      document.getElementById("promoBadge").innerHTML = escapeHtml(promo.badgeText).replace(/\n/g, "<br>");
      document.getElementById("promoTitle").textContent = promo.title;
      document.getElementById("promoSub").textContent = promo.subtitle;

      var productsEl = document.getElementById("promoProducts");
      promo.rows.forEach(function (row) {
        var rowEl = document.createElement("div");
        rowEl.className = "promo-row promo-row-" + row.items.length;

        row.items.forEach(function (item) {
          var itemEl = document.createElement("div");
          itemEl.className = "promo-item";
          itemEl.innerHTML =
            "<h4>" + escapeHtml(item.name) + "</h4>" +
            '<span class="promo-qty' + (item.limited ? " promo-qty-limited" : "") + '">' + escapeHtml(item.qty) + "</span>" +
            "<p><del>" + escapeHtml(item.original) + "</del> <strong>" + escapeHtml(item.sale) + "</strong></p>";
          rowEl.appendChild(itemEl);
        });

        productsEl.appendChild(rowEl);
      });

      if (localStorage.getItem(PROMO_KEY) !== new Date().toDateString()) {
        setTimeout(function () {
          promoOverlay.classList.add("active");
        }, 400);
      }
    })
    .catch(function () {});
}

function initColumnGrid(columnGrid) {
  fetch("data/columns.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      data.posts.forEach(function (post) {
        var card = document.createElement("a");
        card.href = "column.html?id=" + encodeURIComponent(post.id);
        card.className = "column-card";

        var thumbStyle = post.image
          ? ' style="background-image:url(\'' + post.image + '\');background-size:cover;background-position:center;color:transparent;"'
          : "";

        card.innerHTML =
          '<div class="column-thumb"' + thumbStyle + ">" + (post.image ? "" : escapeHtml(post.title)) + "</div>" +
          '<div class="column-body">' +
          '<span class="column-tag">' + escapeHtml(post.tag) + "</span>" +
          "<h3>" + escapeHtml(post.title) + "</h3>" +
          "</div>";

        columnGrid.appendChild(card);
      });
    })
    .catch(function () {});
}

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
