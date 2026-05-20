import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "src/uploads/temp");

    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ "-"+ file.originalname);
    },
});

const fileFilter = (req, file, cb)=>{
    const allowTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
    ];
 if(allowTypes.includes(file.mimetype)){
    cb(null, true)
 }else{
    const err = new Error("Invalid file type. Only PDF, PNG, and JPEG are allowed.");
    err.statusCode = 400;
    cb(err, false);
 }
};

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 5*1024*1024,
    },
});

export const assignmentUpload = upload.fields([
    { name: "file", maxCount: 1 },
    { name: "assignment", maxCount: 1 },
]);

export default upload;