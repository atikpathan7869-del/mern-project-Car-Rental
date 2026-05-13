const path = require("path")
const fs = require("fs")
const uploadFile = (base64Content, fileName) => {
    const imgPath = path.join(__dirname, "../Content/Photo/") + fileName;
    console.log("Image Path: ",imgPath);
    const base64Data = base64Content.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(imgPath, base64Data, "base64");
}

module.exports = {
    uploadFile
}