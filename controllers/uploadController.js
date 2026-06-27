const fs = require("fs");
const csv = require("csv-parser");
const ExcelJS = require("exceljs");

const { Product, Category } = require("../models");

exports.uploadCSV = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    const rows = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => rows.push(data))

        .on("end", async () => {

            try {

                for (const row of rows) {

                    let category = await Category.findOne({
                        where: {
                            name: row.category.trim()
                        }
                    });

                    if (!category) {

                        category = await Category.create({
                            name: row.category.trim()
                        });

                    }

                    await Product.create({

                        name: row.name,

                        price: Number(row.price),

                        image: row.image,

                        categoryId: category.id

                    });

                }

                fs.unlinkSync(req.file.path);

                res.json({
                    success: true,
                    message: "Products Uploaded Successfully",
                    total: rows.length
                });

            } catch (err) {

                console.error(err);

                res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

        });

};

exports.uploadExcel = async (req, res) => {

    try {

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(req.file.path);

        const sheet = workbook.getWorksheet(1);

        for (let i = 2; i <= sheet.rowCount; i++) {

            const name = sheet.getRow(i).getCell(1).value;
            const price = sheet.getRow(i).getCell(2).value;
            const image = sheet.getRow(i).getCell(3).value;
            const categoryName = sheet.getRow(i).getCell(4).value;

            let category = await Category.findOne({
                where: {
                    name: categoryName
                }
            });

            if (!category) {

                category = await Category.create({
                    name: categoryName
                });

            }

            await Product.create({

                name,

                price,

                image,

                categoryId: category.id

            });

        }

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: "Excel Uploaded Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
exports.downloadCSV = async (req, res) => {

    try {

        const products = await Product.findAll({
            include: Category
        });

        let csvData = "Name,Price,Image,Category\n";

        products.forEach(product => {

            csvData += `${product.name},${product.price},${product.image || ""},${product.Category ? product.Category.name : ""}\n`;

        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=products.csv"
        );

        res.send(csvData);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.downloadExcel = async (req, res) => {

    try {

        const products = await Product.findAll({
            include: Category
        });

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Products");

        sheet.columns = [

            { header: "Name", key: "name", width: 30 },
            { header: "Price", key: "price", width: 20 },
            { header: "Image", key: "image", width: 30 },
            { header: "Category", key: "category", width: 30 }

        ];

        products.forEach(product => {

            sheet.addRow({

                name: product.name,
                price: product.price,
                image: product.image,
                category: product.Category ? product.Category.name : ""

            });

        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=products.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};