const UserModel = require("../models/user");
const Profile = require("../models/profile");
const StudyLevel = require("../models/StudyLevel");
const Specialization = require("../models/specializations");
const argon2 = require("argon2");
const validator = require("validator");

const UserService = {
  login: async (email, password) => {
    if (!email || !password) {
      throw new Error("Invalid credentials"); // موحّد
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials"); // ما نعطيش تفاصيل
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await UserModel.findOne({
      where: { email: normalizedEmail },
      attributes: ["id", "username", "email", "password_hash"],
      include: [
        {
          model: Profile,
          include: [StudyLevel, Specialization],
        },
      ],
    });

    const fakeHash =
      "argon2id$v=19$m=65536,t=3,p=4$kTvqwtQcej02pii9Qzylsw$D5Do7967Q7pWEvs3UdUTeSrxma59jjBGXvvMf+vnuyM";

    const isValid = await argon2.verify(
      user ? user.password_hash : fakeHash,
      password
    );

    if (!user || !isValid) {
      throw new Error("Invalid credentials");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.Profile ?? null,
    };
  },
};

module.exports = UserService;
