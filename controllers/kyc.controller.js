const multer = require('multer');
const User = require("../models/user.model");

class KycController {

    async handleKycSubmit(req, res) {
        try {

            const kycData = {
                kyc: {
                    fullName: req.body.fullName,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    governmentIssuedId: {
                        idType: req.body.idType,
                        picture: req.files.map(file => file.filename)
                    }
                }
            }


            const user = await User.findByIdAndUpdate(req.user._id, kycData);

            req.flash("success", "Your Kyc Information Was Submitted Successfully")
            res.redirect("/user/kyc")
        } catch (error) {
            req.flash("fail", "Something Went Wrong. Please Try Again")
            res.redirect("/user/kyc")
        }

    }
}

module.exports = new KycController()