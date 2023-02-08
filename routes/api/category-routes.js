const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    if (!categories){
      res.status(404).json({ message: 'Database error - no categories were found!'})
    return;
  }
  res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const categories = await Category.findByPk(req.params.id, {
      include: [{ model: Product}],
    });
    if(!categories){
      res.status(404).json({ message: 'Category not found!'})
      return;
    }
    res.status(200).json(categories);
  } catch(err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  Category.create(req.body)
  .then((category) => {
    res.status(200).json(category);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  })
});

router.put('/:id', async(req, res) => {
  // update a category by its `id` value
  console.log(req.body)
  try{
    const categoryID = await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

  if(!categoryID){
    res.status(404).json({ message: "No category found with this id"});
    return;
  }

  console.log("\u001b[36mCategory Updated")
  res.status(200).json(categoryID);
} catch(err){
  res.status(500).json(err);
}
});



router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!categoryData){
      res.status(404).json({ message: "No category found with this id"});
      return;
    }
    console.log("\u001b[31mCategory deleted");
    res.status(200).json(categoryData);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
