export default {
  upload: (req, res, next) => {
    if (!req.isAuth) {
      const error = new Error('Unauthenticated!') as any;
      error.status = 401;
      throw error;
    }

    if (!req.file) {
      return res.status(200).json({ message: 'No file selected' });
    }

    // if (req.body.oldPath) {
    //   clearImage(req.body.odlPath);
    // }

    return res.status(200).json({ message: 'File stored', fileName: req.file.filename });
  }
};
