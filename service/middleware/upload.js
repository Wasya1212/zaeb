const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dtquxmxcs',
  api_key: '219447449487377',
  api_secret: 'YsATAdSo0HSkKKu1Xhp9n4bV3js'
});

const upload = async filename => {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filename, function(error, result) {
      if (error) {
        reject(error)
      }

      resolve(result);
    });
  });
}

module.exports = upload;
