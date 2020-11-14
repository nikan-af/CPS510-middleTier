const express = require('express');
const router = express.Router();

app = express();

const ctrl = require('../controllers/main.controller');

router.post('/createTable', ctrl.createTable);
router.get('/createAll', ctrl.createAll);
router.post('/deleteTable', ctrl.deleteTable);
router.get('/deleteAll', ctrl.deleteAll);
router.get('/getUsers', ctrl.getUsers);
router.get('/getGuests', ctrl.getGuests);
router.get('/getStaff', ctrl.getStaff);
router.get('/getPayRates', ctrl.getPayRates);
router.get('/getRooms', ctrl.getRooms);
router.get('/getVisits', ctrl.getVisits);
router.get('/getPayments', ctrl.getPayments);
router.get('/getHotelServices', ctrl.getHotelServices);
router.get('/getHotelServicesBookings', ctrl.getHotelServicesBookings);
router.post('/deleteRecord', ctrl.deleteRecord);
router.post('/populateTable', ctrl.populateTable);
router.get('/populateAll', ctrl.populateAll);
router.post('/executeScript', ctrl.executeScript);

module.exports = router;