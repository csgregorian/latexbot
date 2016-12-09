var login = require("facebook-chat-api");
var mjAPI = require("mathjax-node/lib/mj-single.js");
var fs = require("fs");


mjAPI.config({
	MathJax: {}
});
mjAPI.start();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;



login({email: email, password: password}, (err, api) => {
	if (err) return console.error(err);

	api.setOptions({selfListen: true});

	api.listen((err, message) => {
		let text = message.body;
		let id = message.threadID;

		if (text == undefined) return;

		console.log(text);

		if (!text.startsWith("$") || !text.endsWith("$")) {
			return;
		}

		mjAPI.typeset({
			math: text,
			format: "inline-TeX",
			png: true
		}, (data) => {
			var img = data.png.replace(/^data:image\/png;base64,/, "");
			fs.writeFileSync("out.png", img, 'base64');

			var msg = {
				body: "",
				attachment: fs.createReadStream(__dirname + "/out.png")
			};

			api.sendMessage(msg, id);
		});


	});
});
