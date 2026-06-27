const { Category } = require("../models");

exports.create = async (req, res) => {

    res.json(

        await Category.create(req.body)

    );

};

exports.getAll = async (req, res) => {

    res.json(

        await Category.findAll()

    );

};

exports.update = async (req, res) => {

    await Category.update(

        req.body,

        {

            where: {

                id: req.params.id

            }

        }

    );

    res.json({

        message: "Updated"

    });

};

exports.remove = async (req, res) => {

    await Category.destroy({

        where: {

            id: req.params.id

        }

    });

    res.json({

        message: "Deleted"

    });

};