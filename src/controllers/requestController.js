const RequestModel = require("../models/requests").model;

module.exports = {
  createRequest: async (req, res) => {
    try {
      const { full_name, email, phone_number, description } = req.body ?? {};

      const errors = {};

      if (!full_name) errors.full_name = "Full name is required";
      if (!email) errors.email = "Email is required";
      if (!phone_number) errors.phone_number = "Phone number is required";
      if (!description) errors.description = "Description is required";


      if (full_name && typeof full_name !== "string")
        errors.full_name = "Full name must be a string";
      if (email && typeof email !== "string")
        errors.email = "Email must be a string";
      if (phone_number && typeof phone_number !== "string")
        errors.phone_number = "Phone number must be a string";
      if (description && typeof description !== "string")
        errors.description = "Description must be a string";


      if (full_name && (full_name.length < 2 || full_name.length > 100))
        errors.full_name = "Full name must be between 2 and 100 characters";

      if (email && (email.length < 5 || email.length > 100))
        errors.email = "Email must be between 5 and 100 characters";

      if (phone_number && (phone_number.length < 7 || phone_number.length > 15))
        errors.phone_number =
          "Phone number must be between 7 and 15 characters";

      if (description && (description.length < 10 || description.length > 200))
        errors.description =
          "Description must be between 10 and 1000 characters";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailPattern.test(email))
        errors.email = "Email format is invalid";

      const phonePattern = /^(05|06|07)[0-9]{8}$/;
      if (phone_number && !phonePattern.test(phone_number))
        errors.phone_number = "Phone number format is invalid";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
      }

      const existing = await RequestModel.findOne({
        where: { email: email.trim().toLowerCase() },
      });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      const newRequest = await RequestModel.create({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number.trim(),
        description: description.trim(),
      });

      res.status(201).json({
        success: true,
        message: "Request created successfully",
        data: {
          id: newRequest.id,
          full_name: newRequest.full_name,
          email: newRequest.email,
          phone_number: newRequest.phone_number,
          description: newRequest.description,
          created_at: newRequest.created_at,
        },
      });
    } catch (error) {
      console.error("Error creating request", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the request",
      });
    }
  },
};
