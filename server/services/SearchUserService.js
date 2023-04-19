const { Op } = require('sequelize');
const { User } = require('../models/User');
const { CustomError } = require('../utils/Error');
const { SearchUser } = require('../utils/SearchUser');


class SearchUserService {
    static async searchUser(req, res, next){
        const searchString = req.query.data;
        try{
            const users = await User.findAll({
                attributes: ['username'],
                where: {
                    username: {
                        [Op.like]: `%${searchString}%`
                    }
                }
            });
            const response = users.map(user => new SearchUser(user.username, false));
            return res.json({error: undefined, content: response});
        } catch (err) {
            const error = new CustomError('DatabaseError', 'There was a problem searching the users. You should panic!');
            return res.json({error, content: undefined});
        }

    }
}

module.exports = { SearchUserService };