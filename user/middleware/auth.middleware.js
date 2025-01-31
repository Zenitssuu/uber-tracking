const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklisttoken.model');


module.exports.userAuth = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // console.log(token);
        
        const isBlacklisted = await blacklistTokenModel.find({ token });
        // console.log(isBlacklisted);
        

        if(isBlacklisted.length) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        delete user._doc.password; //deleting the password feild from user document
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}