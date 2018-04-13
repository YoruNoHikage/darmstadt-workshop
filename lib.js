(function(window) {
	window.Ptypo = {};

	var loadedFonts = {};

	var values = Ptypo.values = {};
	var init = Ptypo.init = {};
  var tweens = Ptypo.tweens = {};
	Ptypo.createFont = function( name, font, template) {
		var data = {};

		return window.PrototypoCanvas.init({
			canvas: document.getElementById('canvas'),
			workerUrl: '/ptypo/worker.js',
			workerDeps: document.querySelector('script[src*=prototypo\\.]').src,
			onlyWorker: true,
			familyName: name,
		}).then(function( instance ) {
			if (loadedFonts[template]) {
				data = loadedFonts[template];
				return instance.loadFont(font, loadedFonts[template]);
			}

			return fetch('https://e4jpj60rk8.execute-api.eu-west-1.amazonaws.com/prod/fonts/' + template, {
				headers: {
					'Authorization': 'Bearer e0b256f9-5438-4c84-8d14-9a5ec5bf2faf',
					'Content-Type': 'application/json'
				},
				cache: 'force-cache',
			}).then(function(data) {
				return data.json();
			}).then(function(json) {
				loadedFonts[template] = json;
				data = json;
				return instance.loadFont(font, json);
			});
		}).then(function( instance ) {
			Ptypo[name] = instance;
			values[name] = {};
			tweens[name] = {};
			init[name] = {};
			data.controls.forEach(function( control ) {
				control.parameters.forEach(function(param) {
					init[name][param.name] = param.init;
					values[name][param.name] = param.init;
				});
			});
			Ptypo[name].subset = ',.0345?ACEFGLPSTWYabcdefghijklmnopqrstuvwxy’';
			Ptypo[name].update(values[name]);
		});
	}

  Ptypo.changeParam = function(value, name, font) {
    if (values[font]) {
      values[font][name] = value;
  		Ptypo[font].update(values[font]);
    }
	}

	Ptypo.changeAllParams = function(fontValues, font) {
		delete fontValues['manualChanges'];
    if (values[font]) {
      values[font] = fontValues;
  		Ptypo[font].update(values[font]);
    }
	}

	Ptypo.getParam = function(name, font) {
		return values[font][name];
	}

	Ptypo.reset = function(font) {
		Object.keys(init[font]).forEach(function(key) {
			values[font][key] = init[font][key];
		});
		Ptypo[font].update(values[font]);
	}

	Ptypo.tween = function(value, name, font, steps, aDuration, cb) {

    if (!values[font]) {
      return;
    }

		const duration = aDuration * 1000;
		if (tweens[font][name]) {
			clearInterval(tweens[font][name].intervalId);
      delete tweens[font][name];
		}

		var start = values[font][name];

		tweens[font][name] = {
			target: value,
		}

		var elapsed = 0;
		var id = setInterval(function() {
			if (elapsed >= duration) {
				clearInterval(id);
				if (cb) {
					cb(name, font);
				}
				return;
			}
			var newValue = (start * (duration - elapsed) + value * elapsed) / duration;
			Ptypo.changeParam(newValue, name, font, true);
			elapsed += duration / steps;
		}, duration / steps);

		tweens[font][name].intervalId = id;
	}
}(window))
