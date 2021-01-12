const express = require('express')
const router = express.Router();
const controller = require('../controllers/tower.js')
const { body, validationResult, param} = require('express-validator');

router.get('/', function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        controller.getTower(req, res);
    } else {
        res.status(404).json({
            errors: errors.array()
        })
    }
})

router.route('/salas')

    .get( function (req, res) {
        const errors = validationResult(req); 
        if (errors.isEmpty()) {
            controller.getRooms(req, res); 
        } else {
            res.status(404).json({errors: errors.array()})
        }
    })
   

router.get('/salas/:number', [
    param('number').notEmpty().escape(),
], function (req, res) {
    const errors = validationResult(req); 
    if (errors.isEmpty()) {
        controller.getRoomsByNumber(req, res); 
    } else {
        res.status(404).json({errors: errors.array()})
    }
})




module.exports = router;