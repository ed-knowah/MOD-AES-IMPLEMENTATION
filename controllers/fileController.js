const User = require("../models/userModel");
const noahAes = require("../noahAes");
const aes = require("../Aes");
const fs = require("fs");
const bcrypt = require("bcrypt");
const stringSimilarity = require("string-similarity");
const path = require("path");

module.exports = {
  getUploadForm: async (req, res) => {
    const user = req.session.user.email;
    res.render("uploadForm", { user: user });
  },

  getDownloadForm: async (req, res) => {
    const user = req.session.user.email;
    res.render("downloadForm", { user: user });
  },

  encryptFile: async (req, res) => {
    const file = req.file;
    const id = req.session.user._id;
    const { fileKey } = req.body;
    //console.log(file);

    if (!file) return res.status(400).send("No file in the request");
    if (!fileKey) return res.status(400).send("Please supply your file key");

    const fileName = file.filename;
    const fileOriginalName = file.originalname;
    //console.log(file)

    if (file.size >= 8777776) {
      res.send("Your file is too large");
    } else {
      //Convert file to base64 and encrypt
      try {
        const base64 = fs.readFileSync(path.join(`${__dirname}/uploads/${fileName}`), "base64");
        const encr = await noahAes.Ctr.encrypt(base64, fileKey, 256);

        //write encrypted data to file
        fs.writeFileSync(path.join(`${__dirname}/uploads/${fileName}`, encr));

        const person = await User.userModel.findByIdAndUpdate(
          { _id: id },
          {
            encryptedData: encr,
            fileKey: await bcrypt.hash(fileKey, 10),
            fileName: fileName,
            fileOriginalName: fileOriginalName,
          },
          { new: true }
        );
        if (!person) {
          return res.send("cannot update");
        }
        //console.log(person);
      } catch (error) {
        console.log(error);
      }

      res.download(path.join(`${__dirname}/uploads/${file.fileName}`, `${fileOriginalName}`));
    }
  },

  decryptFile: async (req, res) => {
    const fileKey = req.body.fileKey;
    const email = req.session.user.email;

    try {
      const findUser = await User.userModel.findOne({ email });
      //console.log(findUser);

      if (!findUser) {
        return res.status(404).json({
          found: "false",
          message: "Can't find user",
        });
      }
      const isMatch = await bcrypt.compare(fileKey, findUser.fileKey);
      //console.log(isMatch);
      if (isMatch) {
        const encryptedFile = findUser.encryptedData;
        //console.log(encryptedFile)
        const decryptFile = noahAes.Ctr.decrypt(encryptedFile, fileKey, 256);

        const buffer = Buffer.from(decryptFile, "base64"); // after dec data will be in base64 then change it back to buffer
        //console.log(buffer);
        const filename = findUser.fileName;

        // write decrypted buffer back to the file
        fs.writeFileSync(path.join(`${__dirname}/uploads/${fileName}`, buffer));
        res.download(path.join(`${__dirname}/uploads/${fileName}`, `${findUser.fileOriginalName}`));
      } else {
        return res.status(404).json({
          decrypt: "false",
          message: "invalid file key",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
