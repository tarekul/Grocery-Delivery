const verifyUpdateUserRequest = async (req, res, next) => {
  const { uid, ...rest } = req.body;

  if (!uid || typeof uid !== "string") {
    return res.status(400).send({ message: "Invalid or missing uid." });
  }

  const allowedFields = {
    firstName: "string",
    lastName: "string",
    address: "string",
    zipcode: "string",
    city: "string",
    phone: "string",
  };

  for (const [key, value] of Object.entries(rest)) {
    if (!allowedFields[key]) {
      return res.status(400).send({ message: `Invalid field: ${key}` });
    }
    if (typeof value !== allowedFields[key]) {
      return res.status(400).send({
        message: `Invalid type for ${key}. Expected ${allowedFields[key]}.`,
      });
    }
  }

  next();
};

module.exports = verifyUpdateUserRequest;
