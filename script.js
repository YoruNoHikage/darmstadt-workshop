window.onload = function(e) {

  var fontPromises = [];

  fontPromises.push(
    /* Here you create the font with the template you want */
    /* 
      Antique Gothic: antique.ptf
      Grotesk: venus.ptf
      Spectral: gfnt.ptf
      John Fell: john-fell.ptf
      Elzevir: elzevir.ptf
    */
   
    // just copy paste these three lines if you want to have another font
    Ptypo.createFont('my-font', 'font', 'antique.ptf').then(function() {
      // type your word in the subset, or the glyphs might not load
      Ptypo['my-font'].subset = 'Hello There';
    }),
  );

  Promise.all(fontPromises).then(function() {
    /* Here you can change initial parameters of your font */
    Ptypo.changeParam(100, 'thickness', 'my-font');

    /* Here you can change parameters from the sound */
    window.updateFontsWithSound = debounce(function (low, medium, high) {

      Ptypo.changeParam(low / 3 + 4,'thickness','my-font');
      Ptypo.changeParam((medium / 230) + 0.45, 'width', 'my-font');
      Ptypo.changeParam((high / 10) - 3, 'slant', 'my-font');

    }, 10);
    
    window.updateFontsWithKeyboard = (key) => {
      
      // value, parameter name, font name, steps, duration, what to do after
      Ptypo.tween(80, 'thickness', 'my-font', 60, 0.3, function () {

        Ptypo.changeParam(100, 'thickness', 'my-font');

      });
      
      // Ptypo.changeParam(100,'thickness','my-font');
      // Ptypo.changeParam(20, 'width', 'my-font');
    
    }

  });

}