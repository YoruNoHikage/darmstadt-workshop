document.addEventListener('keydown', function(e) {
  e = e || window.event;
  var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

  window.updateFontsWithKeyboard(event.key);
});

document.body.addEventListener('mousepress', function () {
  if (window.updateFontsWithClick) {
    window.updateFontsWithClick();
  }
})
