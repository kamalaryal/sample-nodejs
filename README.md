Sample api for Login Portal with Node JS and React JS

Technology use:

Node JS
React JS
MongoDB

Running Locally Make sure you have Node.js, React.js and MongoDB git clone https://github.com/kamalaryal/sample-nodejs.git cd sample-nodejs-master npm install npm start

Your app should now be running on localhost:5001. The app runs with the build file.

#Note: If you want to run api with React JS cd client npm install npm start

Import the following data for creating the admin user for first time. You can import the data using mongoDB compass community or others any tools. Migration is not required. But use the below as a sample for creating the first user. You can change fullName, email only.

Sample Data:
{
   _id: 5d35d29097a2da229444e9bd
  resetPasswordExpires: 2019-07-22 13:39:09.701
  createdAt: 2019-07-22 15:13:21.086
  fullName: "FirstName LastName"
  email: "example@example.com"
  password:"$2b$10$ZPxx0TAJv3uQZrN4o35nNeapM.UK7Nt1Bozm8i9sCeZ6k3pZ9ejTi"
  passwordChangeStatus: false
  multiUseToken: "BB05d35d29097a2da229444e9bePWf0LP6Lmj5d35d29097a2da229444e9bdS7G"
  verificationStatus: "pending"
  resetPasswordToken: "BB05d35d29097a2da229444e9bePWf0LP6Lmj5d35d29097a2da229444e9bdS7G"
  status: true
  role: "admin"
  otpCode: "FZDWMSCDMYUWIUTUKBOX2RJVJBKTSIJQEY7XSML2FIYG25TU"
  __v:0
}

#Note:- Change the name and email before import of the data. Passowrd is Nepal123 for abpve hash code

Now, login with you email and above password. Then change the password, login the with email and new-password. OTP code is console in terminal or you can access even in email, but it expire within 30 seconds. If it says auth on OTP code generate new one since it is alredy expired. 
