const router = require('express').Router();
const apiRoutes = require('./api.js')
const htmlRoutes = require('./html-routes.js');

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;