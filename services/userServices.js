const bcrypt = require("bcrypt");
const saltRounds = 10;

var mysql = require("mysql2/promise");
var mysqlPool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "123456",
	database: "bmtt",
	insecureAuth: true,
});

class UserService {
	hashPassword(password) {
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(password, salt);
		return hash;
	}

	checkHashPassword(password, hash) {
		return bcrypt.compareSync(password, hash);
	}

	async loginUser(email, password) {
		var q = `select COUNT(*) as count from user where email = "${email}" and userPassword = "${password}"`;
		console.log(q);
		const data = await mysqlPool.query(q);

		if (data[0][0].count > 0) {
			return true;
		} else {
			return false;
		}
	}
	async loginUserwithHash(email, password) {
		const query = "SELECT userPassword FROM user WHERE email = ?";
		var checkUser = await mysqlPool.query(query, [email]);
		if (checkUser.length > 0) {
			console.log(checkUser[0][0].userPassword);
			const hashedPassword = checkUser[0][0].userPassword;
			// So sánh mật khẩu nhập vào với hash từ DB
			const checkPass = await bcrypt.compare(password, hashedPassword);
			console.log(checkPass);
			return checkPass;
		} else {
			return false;
			// Xử lý trường hợp không tìm thấy người dùng
		}
	}

	async checkUserExists(email) {
		var q = `select COUNT(*) AS count from user where email = "${email}"`;
		console.log(q);
		const data = await mysqlPool.query(q);

		if (data[0][0].count > 0) {
			return {
				exists: true,
				message: "Tài khoản đã tồn tại !",
			};
		} else {
			return {
				exists: false,
				message: "",
			};
		}
	}

	create(email, password, res) {
		var hashPassword = this.hashPassword(password);
		var insert = `INSERT INTO user (email, userPassword) values ("${email}", "${hashPassword}")`;
		mysqlPool
			.query(insert)
			.then((data) => {
				if (data[0].affectedRows > 0) {
					res.status(200).send("Tạo thành công");
				}
			})
			.catch((err) => res.status(400).send("Tạo không thành công"));
	}
}

module.exports = new UserService();
