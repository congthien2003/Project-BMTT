var userServices = require("../../services/userServices");

var mysql = require("mysql2/promise");

var mysqlPool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "123456",
	database: "bmtt",
	insecureAuth: true,
});

class SiteController {
	async login(req, res, next) {
		const email = req.body.email;
		const password = req.body.password;
		// const passinjection = "1234" or 1=1 -- "
		console.log(email);
		console.log(password);
		// var login = await userServices.loginUser(email, password);
		var login = await userServices.loginUserwithHash(email, password);
		console.log("login ", login);
		if (login == true) {
			res.status(200).send("Đăng nhập thành công");
		} else {
			res.status(400).send("Đăng nhập không thành công!");
		}
	}

	// Not hash password
	userStore(req, res, next) {
		const email = req.body.email;
		const password = req.body.password;
		console.log(email);
		console.log(password);
		var q = `select COUNT(*) AS count from user where email = "${email}"`;
		console.log(q);
		mysqlPool.query(q).then((data) => {
			if (data[0][0].count > 0) {
				return res
					.status(400)
					.send({ message: "Người dùng đã tồn tại." });
			} else {
				var insert = `INSERT INTO user (email, userPassword) values ("${email}", "${password}")`;
				console.log(insert);
				mysqlPool
					.query(insert)
					.then((data) => {
						return res
							.status(200)
							.send({ message: "Tạo tài khoản thành công" });
					})
					.catch((Error) => {
						return res.status(500).send("Error");
					});
			}
		});
	}
	// Hash password
	async userStoreWithHash(req, res, next) {
		const email = req.body.email.trim();
		const password = req.body.password.trim();
		var check = await userServices.checkUserExists(email);
		console.log(check);
		if (check.exists == false) {
			userServices.create(email, password, res);
		} else {
			res.status(400).send({ message: check.message });
		}
	}

	register(req, res, next) {
		res.render("register");
	}

	index(req, res, next) {
		res.render("home");
	}
}

module.exports = new SiteController();
