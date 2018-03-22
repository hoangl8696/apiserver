const user = require('../model/user');
module.exports.updateUser = async (req,res) => {
    try {
        const newUser = await user.updateUser(req.user._id, req.body);   
        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json({err});
    }    
}