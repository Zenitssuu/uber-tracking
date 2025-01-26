const user = require('../models/user.model');
const blacklistToken = require('../models/blacklisttoken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await user.findOne({ email });

        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);
        res.send({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.login = async (req, res) => {    
    try {
        const { email, password } = req.body;
        const user = await userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }   

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete user._doc.password;
        
        res.cookie('token', token);
        res.send({token,user});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.logout = async (req, res) => {    
    try {
        const token = req.cookies.token
        await blacklistToken.create({ token });
        res.clearCookie('token');
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.profile = async (req, res) => {  
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}