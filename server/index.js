// const express=require("express")
// const mongoose=require('mongoose')
// const cors=require("cors")
// const EmployeeModel=require('./models/Employee')

// const app=express()
// app.use(express.json())
// app.use(cors())

// mongoose
//   .connect("mongodb+srv://ambadkarvaishnavi667:Sunitaambadkar@signup.q9zwd.mongodb.net/logindb?retryWrites=true&w=majority&appName=signup", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
  
//   EmployeeModel.findOne({ email: email })
//     .then(user => {
//       if (user) {
//         if (user.password === password) {
//           res.json({ message: "Success", user }); // Send success message
//         } else {
//           res.status(401).json({ message: "The password you have entered is incorrect" }); // Password incorrect
//         }
//       } else {
//         res.status(404).json({ message: "No record existed" }); // User not found
//       }
//     })
//     .catch(err => res.status(500).json(err)); // Server error
// });


// app.post('/', (req,res) => {
//     EmployeeModel.create(req.body)
//     .then(employees=> res.json(employees))
//     .catch(err=>res.json(err))
// })

// app.listen(3001, () => {
//     console.log("server is running")
// })

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors(
  {
  origin: [""],
  methods: ["POST","GET"],
  credentials: true
  }
));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dar0bjrax", // Replace with your Cloudinary cloud name
  api_key: "176993643569666", // Replace with your Cloudinary API key
  api_secret: "_2IWSycsEs6u6qUIwGgVEsdc6Q0", // Replace with your Cloudinary API secret
});

// Multer Storage Configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_uploads", // Folder in Cloudinary for storing images
    allowedFormats: ["jpg", "jpeg", "png", "gif"], // Allowed file formats
  },
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.set('strictQuery', false); // To avoid deprecation warning

mongoose.connect(
  "mongodb+srv://ambadkarvaishnavi667:Sunitaambadkar@signup.q9zwd.mongodb.net/logindb?retryWrites=true&w=majority&appName=signup",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/",(req,res) => {
  res.json("Hm");
}
  )
  
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Route for login (existing functionality)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json({ message: "Success", user });
        } else {
          res.status(401).json({ message: "The password you have entered is incorrect" });
        }
      } else {
        res.status(404).json({ message: "No record found" });
      }
    })
    .catch((err) => res.status(500).json(err));
});

// Route to handle signup and file upload
app.post("/signup", upload.single("file"), (req, res) => {
  const { name, email, dob, password } = req.body;
  console.log(req.file);
  const imageUrl = req.file ? req.file.path : ""; // Correct way to get the Cloudinary URL

  // Check if any required fields are missing
  if (!name || !email || !dob || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create new employee document
  const employeeData = {
    name,
    email,
    dob,
    password, // Store password as plain text (not recommended for production)
    imageUrl,
  };

  EmployeeModel.create(employeeData)
    .then((employee) => res.json(employee))
    .catch((err) => {
      console.error("Error during signup:", err);
      res.status(500).json({ message: "An unexpected error occurred. Please try again." });
    });
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});


     
 
