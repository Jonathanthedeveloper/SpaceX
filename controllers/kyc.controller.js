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

            req.flash("success", "your kyc information was submitted successfully")
            res.redirect("/user/kyc")
        } catch (error) {
            req.flash("success", "Something went wrong. please try again")
            res.redirect("/user/kyc")
        }

    }
}

module.exports = new KycController()