const uploadImage = (req, res) => {
    // console.log(req.body);
    console.log(req.file);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // Return the image file path to the client
    res.status(200).send({
      message: 'File uploaded successfully.',
      file: req.file.path.replace(/^.*[\\/]/, '')
    });
};

const getImage = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
  
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
};

export {uploadImage, getImage};