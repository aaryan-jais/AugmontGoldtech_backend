const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      image: req.file ? req.file.filename : null,
      price: req.body.price,
      categoryId: req.body.categoryId 
    });

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.list = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.name) {
      where.name = {
        [Op.like]: `%${req.query.name}%`
      };
    }

    const data = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          required: false // 
        }
      ],
      limit,
      offset,
      order: [["price", req.query.sort || "ASC"]]
    });

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  try {

    await Product.update(
      {
        name: req.body.name,
        price: req.body.price,
        categoryId: req.body.categoryId
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    res.json({
      message: "Updated"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  try {

    await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    res.json({
      message: "Deleted"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};