const multer = require("multer")
const crypto = require("crypto");


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, `${__dirname}/../public/uploads`);
    },
    filename(req, file, cb) {

        const ext = file.originalname.split('.').at(-1);
        const fileName = `kyc-${req.user._id}-${crypto.randomUUID()}-${Date.now()}.${ext}`;
        cb(null, fileName)
    },
    fileFilter(req,file, cb){
        if(!file || !file.mimetype.startsWith("image")){
            return cb(null, false)
        } else {
            cb(null, true)
        }
    }
})



const upload = multer({storage})

module.exports = upload

