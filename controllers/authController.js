const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.register = async (req, res) => {

    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({

        email,

        password: hash

    });

    res.json(user);

};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({

        where: { email }

    });

    if (!user)

        return res.status(401).json({

            message: "User not found"

        });

    const ok = await bcrypt.compare(password, user.password);

    if (!ok)

        return res.status(401).json({

            message: "Wrong Password"

        });

    const token = jwt.sign(

        {

            id: user.id

        },

        process.env.JWT_SECRET

    );

    res.json({

        token

    });

};