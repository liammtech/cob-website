module.exports = async (req, res) => {
  console.log('HIT THE API!', req.method);

  return res.status(200).json({
    ok: true,
    method: req.method,
  });
};
