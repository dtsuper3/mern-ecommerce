const fs = require('fs');
const path = require('path');

// Check folder
function checkFolderExist(folderPath) {
    // Throw error if folder path doesn't exist
    if (!folderPath) throw Error('folder path is required');

    // Check folder exists in the path using `fs.existsSync`
    const isFolderExist = fs.existsSync(folderPath);
    return isFolderExist;
};

function createFolder(folderPath) {
    const dir = path.join(__dirname, "../", folderPath);
    console.log({ dir });
    if (!checkFolderExist(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}


// createFolder("/public/uploads")
module.exports = {
    checkFolderExist,
    createFolder
}