const express = require('express');
const router = express.Router();

{/* --- --- Imported Controllers --- --- */ }
const {
    getAllProperties,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/properties');

{/* --- --- Defined Properties Routes --- --- */ }
router.route('/')
    .get(getAllProperties)
    .post(createProperty)

router.route('/:propertyId')
    .get(getProperty)
    .put(updateProperty)
    .delete(deleteProperty)


{/*

Alternatively could use these to separate the routes if I decide not to chain them as done above

router.get('/', getAllProperties)
router.post('/', createProperty)
router.get('/:propertyId', getProperty)
router.put('/:propertyId', updateProperty)
router.delete('/:propertyId', deleteProperty)

*/}



module.exports = router