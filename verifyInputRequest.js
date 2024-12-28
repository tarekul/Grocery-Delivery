const verifyInputRequest = (req, res, next) => {
    const { firstName, lastName, email, phone, address, city, state, zipcode, items, totalPrice } = req.body;

    // Check for required fields and respond with specific error messages
    if (!firstName) {
        return res.status(400).send('First name is required.');
    }
    if (!lastName) {
        return res.status(400).send('Last name is required.');
    }
    if (!email) {
        return res.status(400).send('Email is required.');
    }
    if (!phone) {
        return res.status(400).send('Phone number is required.');
    }
    if (!address) {
        return res.status(400).send('Address is required.');
    }
    if (!city) {
        return res.status(400).send('City is required.');
    }
    if (!state) {
        return res.status(400).send('State is required.');
    }
    if (!zipcode) {
        return res.status(400).send('Zip code is required.');
    }
    if (!items || items.length === 0) {
        return res.status(400).send('At least one item is required.');
    }
    if (!totalPrice) {
        return res.status(400).send('Total price is required.');
    }

    // Validate total price
    const total_price = parseFloat(totalPrice);
    if (isNaN(total_price)) {
        return res.status(400).send('Invalid total price.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email address.');
    }

    // Validate phone number format (assuming 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).send('Invalid phone number. It should be 10 digits.');
    }

    // Validate zip code format (assuming 5 digits)
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipcode)) {
        return res.status(400).send('Invalid zip code. It should be 5 digits.');
    }

    // If all validations pass, proceed to the next middleware
    next();
};

export default verifyInputRequest;