const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("../models/validator").validateUser;

module.exports = {
  // GET FORMS

  getLoginForm: async (req, res) => {
    res.render("login");
  },

  getRegisterForm: async (req, res) => {
    res.render("register");
  },

  getOnboardPage: async (req, res) => {
    res.render("index");
  },

  getHomePage: async (req, res) => {
    let user = req.session.user.email;
    res.render("home", { user: user });
  },

  // REGISTER USER
  createUser: async (req, res) => {
    //validate inputed data
    const { error } = validator.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const person = new User.userModel();
    const { firstname, lastname, email, password, address, city, gender, zip } =
      req.body;
    console.log(password);
    person.firstname = firstname;
    person.lastname = lastname;
    person.email = email;
    person.address = address;
    person.city = city;
    person.gender = gender;
    person.zip = zip;
    const suppliedPassword = password;

    // hash Userpassword
    try {
      person.password = await bcrypt.hash(suppliedPassword, 10);
    } catch (error) {
      console.log("error", error);
    }

    // save new user to DB
    person.save((err, savedObject) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        console.log(savedObject);
        res.redirect("/login");
      }
    });
  },

  //LOGIN USER LOGIC
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const findUser = await User.userModel.findOne({ email });
      //console.log(findUser)
      if (!findUser) {
        return res.status(404).json({
          login: "false",
          message: "invalid username or password",
        });
      }
      const isMatch = await bcrypt.compare(password, findUser.password);

      if (isMatch) {
        //console.log(findUser)
        req.session.isLoggedIn = true;
        req.session.user = findUser;
        req.session.save();
        let id = req.session.id;
        console.log(id);
        //console.log(req.session.user._id);
        res.redirect(`/home`);
      } else {
        return res.status(404).json({
          login: "false",
          message: "invalid username or password",
        });
      }
    } catch (error) {
      return res.json({
        login: false,
        message: "sorry cant log you in at this time",
      });
    }
  },

  logOut: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(404)
        console.log(err);
      }
      res.redirect("/login");
    });
  },
};
