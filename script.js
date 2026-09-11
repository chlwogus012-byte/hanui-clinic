document.addEventListener("DOMContentLoaded", function () {
  initSite();

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

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function initSite() {
  fetch("data/site.json")
    .then(function (res) { return res.json(); })
    .then(function (site) {
      setText("siteNameHeader", site.clinic.name);
      setText("siteNameFooter", site.clinic.name);
      setText("siteNamePromo", site.clinic.name);

      setText("heroEyebrow", site.hero.eyebrow);
      setText("heroTitle", site.hero.title);
      setText("heroDesc", site.hero.description);
      setText("heroSub", site.hero.sub);

      setText("philosophyLine1", site.philosophy.titleLine1);
      setText("philosophyHighlight", site.philosophy.titleHighlight);
      setText("philosophyDesc", site.philosophy.description);

      var valuesGrid = document.getElementById("valuesGrid");
      if (valuesGrid) {
        site.values.forEach(function (value) {
          var card = document.createElement("div");
          card.className = "value-card";
          card.innerHTML =
            '<div class="value-icon">' + escapeHtml(value.icon) + "</div>" +
            "<h3>" + escapeHtml(value.title) + "</h3>" +
            "<p>" + escapeHtml(value.description) + "</p>";
          valuesGrid.appendChild(card);
        });
      }

      var programsGrid = document.getElementById("programsGrid");
      if (programsGrid) {
        site.programs.forEach(function (program, index) {
          var card = document.createElement("div");
          card.className = "program-card";
          var num = String(index + 1).padStart(2, "0");
          card.innerHTML =
            '<div class="program-num">' + num + "</div>" +
            "<h3>" + escapeHtml(program.title) + "</h3>" +
            "<p>" + escapeHtml(program.description) + "</p>";
          programsGrid.appendChild(card);
        });
      }

      var doctorsGrid = document.getElementById("doctorsGrid");
      if (doctorsGrid) {
        site.doctors.forEach(function (doctor) {
          var card = document.createElement("div");
          card.className = "doctor-card";
          var photoStyle = doctor.photo
            ? ' style="background-image:url(\'' + doctor.photo + '\');background-size:cover;background-position:center;color:transparent;"'
            : "";
          card.innerHTML =
            '<div class="doctor-photo"' + photoStyle + ">" + (doctor.photo ? "" : escapeHtml(doctor.name.charAt(0))) + "</div>" +
            "<h3>" + escapeHtml(doctor.name) + "</h3>" +
            "<p>" + escapeHtml(doctor.title) + "</p>";
          doctorsGrid.appendChild(card);
        });
      }

      setText("hoursWeekday", site.hours.weekday);
      setText("hoursSaturday", site.hours.saturday);
      setText("hoursSundayHoliday", site.hours.sundayHoliday);
      setText("hoursLunch", site.hours.lunch);
      setText("systemNote", site.hours.note);

      var telLink = document.getElementById("telLink");
      if (telLink) telLink.href = "tel:" + site.clinic.phoneLink;

      setText("footerAddress", site.clinic.address);
      setText("footerContact", "대표전화 " + site.clinic.phone + "  |  사업자등록번호 " + site.clinic.businessRegNumber);
      setText("footerDirector", "대표원장 " + site.clinic.directorName);
    })
    .catch(function () {});
}

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
