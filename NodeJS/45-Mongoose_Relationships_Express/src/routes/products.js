const { Router } = require("express");
const router = Router();
const Product = require("../models/product");

const categories = ["fruit", "vegetable", "dairy", "fungi"];

router.get("/", async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category: category });
        res.render("products/index", { products, category });
    } else {
        const products = await Product.find({});
        res.render("products/index", { products, category: "All" });
    }
});

router.get("/new", (req, res) => {
    res.render("products/new", { categories });
});

router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm", "name");
    // console.log(product); // QUESTION: Why is product.farm an array???
    res.render("products/show", { product });
});

router.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product, categories });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    res.redirect(`/products/${product._id}`);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    res.redirect("/products");
});

module.exports = router;
