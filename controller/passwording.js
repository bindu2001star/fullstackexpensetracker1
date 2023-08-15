const bcrypt = require("bcrypt");
const uuid = require("uuid");
const sendinblue = require("sib-api-v3-sdk");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../model/user");
const Password = require("../model/passwords");

User.hasMany(Password);
Password.belongsTo(User);

async function forgotpassword(req, res, next) {
  try {
    const { email } = req.body;
    console.log("Printing email : ", email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new error("user doesnt exist");
    } else {
      const id = uuid.v4(); //use random number generator depending on website
      const resetPassword = { id: id, isActive: true };
      const resetpassword = await user.createPassword(resetPassword);
      console.log(resetpassword, "passsworddddddddd");
      const client = sendinblue.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;
      console.log("Check the API Key", apiKey.apiKey);
      const tranEmailApi = new sendinblue.TransactionalEmailsApi();
      const sender = {
        email: "himabindusambangi@gmail.com",
      };
      const receivers = [
        {
          email: `${email}`,
        },
      ];

      const reset = tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "reset password",
        textContent: `Reset your password here`,
        htmlContent: `<a href="http://localhost:10000/password/reset-password/${id}">Reset Password</a>`,
      });
      console.log("email sent successfully");
      res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (err) {
    console.log("Error message in FPC", err.message);
    res.status(400).json({ error: err });
  }
}
async function resetpassword(req, res, next) {
  try {
    const id = req.params.id;
    const resetpassword = await Password.findOne({ where: { id } });
    if (resetpassword) {
      await resetpassword.update({ isActive: false });
      console.log("reset form sent");
      res.status(200).send(`
      <html>
        <script>
          function formsubmitted(event){
            event.preventDefault();
            console.log("called")
          }
          </script>
          <form action="/password/update-password/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
          </form>
        
      </html>
      `);
    }
  } catch (error) {
    console.log("Error message in RPC", err.message);
    res.status(400).json({ error: err });
  }
}
async function updatepassword(req,res,next){
  try{
    const id=req.params.id;
    const newpassword=req.query.newpassword;
    const updatepassword=await Password.findOne({where:{id}});
    const user=await User.findByPk(updatepassword.userId)
    if(user){
      saltrounds=10;
      bcrypt.hash(newpassword,saltrounds,async function(err,hash){
        if(err){
          console.log(err);
          throw new Error(err);
      }
      await user.update({password:hash})
      console.log('Password Update Successfully');
      res.status(201).json({message:"Successfully updated the new password"});
      });
    }else{
      throw new error('user not found')
    }
  }catch(error){
    console.log("error message in upc",error.message);
    res.status(404).json({error:error})

  }

}
module.exports = {
  forgotpassword: forgotpassword,
  resetpassword: resetpassword,
  updatepassword:updatepassword
};
// action="/password/update-password/${id}" method="get"
