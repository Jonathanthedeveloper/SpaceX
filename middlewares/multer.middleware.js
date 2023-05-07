const multer = require("multer")
const crypto = require("crypto");
const path = require("path")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(`${__dirname}/../public/uploads`));
    },
    filename(req, file, cb) {
        console.log(path.join(`${__dirname}/../public/uploads`))
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

