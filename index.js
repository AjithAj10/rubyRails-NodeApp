const express = require("express");
const app = express();
const mongoose = require("mongoose");
var nodemailer = require("nodemailer");
const validatePhoneNumber = require("validate-phone-number-node-js");
const FormModel = require("./Models/formModel");

const cors = require("cors");
app.use(cors());

app.use(express.json());

const url =
  "mongodb+srv://ajithaj:4I1RG80VyFORG1DL@cluster0.5xdqnq2.mongodb.net/?retryWrites=true&w=majority";
let fn = async () => {
  try {
    await mongoose.connect(url);
    console.log("connected...");
  } catch (err) {
    console.error(err);
  }
};
fn();

app.get('/', async (req,res) => {
    let data = await FormModel.find();
    res.json(data);
})

app.post("/", async (req, res) => {
  //validate mobile number
  const isValid = validatePhoneNumber.validate(req.body.phone);
  if (!isValid) {
    return res.status(400).send({
      message: "Invalid phone number",
    });
  }

  //save in the database
  try {
    let form = new FormModel({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
    });

    let saveDb = await FormModel.create(form);

    console.log(saveDb);
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
  //send email to the req.body.email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ajithraveendranr@gmail.com",
      pass: "cdgjuoqnblalbmuh",
    },
  });

  var mailOptions = {
    from: "ajithraveendranr@gmail.com",
    to: req.body.email,
    subject: "Confirmation email from nodejs App",
    text: `Hi ${req.body.name},
     Thankyou for submitting your form`,
  };

  try {
    let info = await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.send("error");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    return res.status(400).send({
      message: e,
    });
  }

  res.send({ message: "success" });
});

app.listen(5000, () => {
  console.log("Server started");
});
