const postInvite = async (req, res) => {
  const { targetEmail } = req.body;
  return res.send('controller is working!');
};

module.exports = postInvite;
