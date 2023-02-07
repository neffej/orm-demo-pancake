const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });
    if (!tags){
      res.status(404).json({ message: 'Database error - no tags were found!'})
    return;
  }
  res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tags = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tags){
      res.status(404).json({ message: 'Tag not found!'})
      return;
    }
    res.status(200).json(tags);
  } catch(err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  // tag_name and productIds
  Tag.create(req.body)
  .then((tag) => {
    if (req.body.productIds.length){
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(tag);
  })
  .then((productIds) => res.status(200).json(productIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!tagData){
      res.status(404).json({ message: "No tag found with this id"});
      return;
    }
    console.log("\u001b[31mTag deleted");
    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
