const express = require('express');
const router = express.Router();
const controller = require('../controllers/museum.js')
const {
    body,
    param,
    validationResult
} = require('express-validator');

router.get('/', function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        controller.getMuseum(req, res);
    } else {
        res.status(404).json({
            errors: errors.array()
        })
    }
})

router.get('/temporary/:name',[
    param('name').notEmpty().escape()
], function(req, res){
    const erros = validationResult(req);
    if(erros.isEmpty()){
        controller.getTempByName(req, res);
    }
    else{
        res.status(404).json({errors: erros.array()})
    }
})

/*router.post('/', [body('description').notEmpty().escape(), body('cover').notEmpty().escape()],
    function (req, res) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            controller.addMuseum(req, res);
        } else {
            res.status(404).jsom({
                errors: errors.array()
            })
        }
    })*/

module.exports = router;