document.onkeypress = function(e) {
  e = e || window.event;
  var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

  if (window.updateFontsWithKeyboard) {
    switch (charCode) {
      case 32:
        window.updateFontsWithKeyboard('space');
        break;
    }
  }
};