const testing = (req, res, next) => {
  console.log("testing middleware");
  next();
};

export default testing;
