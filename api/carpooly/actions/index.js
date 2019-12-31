module.exports = async (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    console.log(err)
  }

  res.status(200).send('hi');
};
