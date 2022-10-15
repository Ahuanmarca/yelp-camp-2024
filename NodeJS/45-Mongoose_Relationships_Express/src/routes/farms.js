const { Router } = require("express");
const router = Router();
const Farm = require("../models/farm");

const routes = {
    farmIndex:              "/",
    deleteFarm:             "/:id",
    newFarmGET:             "/new",
    newFarmPOST:            "/",
    showFarm:               "/:id",
    createProductGET:       "/:farmID/products/new",
    createProductPOST:      "/:farmID/products",
};

// ALL FARMS LIST
router.get(routes.farmIndex, async (req, res) => {
    const allFarms = await Farm.find({});
    res.render("farms/index", { allFarms });
});

// DELETE A FARM
router.delete(routes.deleteFarm, async (req, res) => {
    try {
        const farm = await Farm.findByIdAndDelete(req.params.id);
        res.redirect("/farms");
    } catch (error) {
        console.error(error);
    }
});

// CREATE NEW FARM (FORM)
router.get(routes.newFarmGET, (req, res) => {
    res.render("farms/new");
});

// CREATE NEW FARM (POST)
router.post(routes.newFarmPOST, async (req, res) => {
    try {
        const farm = new Farm(req.body);
        await farm.save();
        res.redirect("/farms");
    } catch (error) {
        console.error(error);
    }
});

// SHOW FARM DETAILS
router.get(routes.showFarm, async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id).populate("products");
        // res.send({ farm });
        res.render("farms/show", { farm });
    } catch (error) {
        console.error(error);
    }
});

// CREATE PRODUCT INSIDE A FARM (GET)
router.get(routes.createProductGET, async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.farmID);
        res.render("products/new", { farm, categories });
    } catch (error) {
        console.error(error);
    }
});

// CREATE PRODUCT INSIDE A FARM (POST)
router.post(routes.createProductPOST, async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.farmID);
        const newProduct = new Product({ ...req.body }); // { name, price, category }
        farm.products.push(newProduct);
        newProduct.farm = farm;
        await farm.save();
        await newProduct.save();
        res.redirect(`/farms/${farm._id}`);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
