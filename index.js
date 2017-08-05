var electron = require('electron');
var path = require('path');
var url = require('url');

var vKeyWindow = null;

electron.app.once('ready', function () {
	vKeyWindow = new electron.BrowserWindow({
    width: 1024,
		height: 576,
		resizable: false,
		show: false,
    frame: false,
    icon: path.join(__dirname, 'app', 'VKey.ico')
	});
	vKeyWindow.loadURL(url.format({
    	pathname: path.join(__dirname, 'app', 'index.html'),
    	protocol: 'file:',
    	slashes: true
	}));
	vKeyWindow.once('ready-to-show', function () {
		// vKeyWindow.setMenu(null);
		vKeyWindow.show();
	});
});
