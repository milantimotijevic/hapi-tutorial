const { getProducts } = require('../controllers/product');

module.exports = [
    {
        method: 'GET',
        path: '/products',
        handler: getProducts,
        config: {
            auth: {
                access: {
                    scope: ['ADMIN', 'USER']
                }
            }
        }
    }
];
