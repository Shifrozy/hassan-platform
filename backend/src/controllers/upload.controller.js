exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Construct accessible URL
  const protocol = req.protocol;
  const host = req.get('host');
  const relativeUrl = `/uploads/${req.file.filename}`;
  const absoluteUrl = `${protocol}://${host}${relativeUrl}`;

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: relativeUrl,
      fullUrl: absoluteUrl
    }
  });
};
