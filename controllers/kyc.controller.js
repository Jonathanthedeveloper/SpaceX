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
                        pictures: req.files.map(file => file.filename)
                    },
                    awaitingVerification: true
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

    async renderAdminKyc(req, res) {
        try {

            const kycData = await User.find({ "kyc.awaitingVerification": true }).select("kyc");
            // kyc: { $exists: true }


            res.render("adminKyc", { kycData })

        } catch (error) {
            req.flash("fail", "Something Went Wrong. Please Try Again")
            res.redirect("/user/admin/kyc")
        }
    }

    async handleKycApproval(req, res) {
        try {

            const approve = req.body.approve === "verify" ? true : false;


            await User.findByIdAndUpdate(req.body.user, { kyc: { isVerified: approve, awaitingVerification: false } }, { new: true });

            req.flash("success", "Kyc Information Was Updated Successfully")
            res.redirect("/user/admin/kyc")

        } catch (error) {
            req.flash("fail", "Something Went Wrong. Please Try Again")
            res.redirect("/user/admin/kyc")
        }
    }
}

module.exports = new KycController()