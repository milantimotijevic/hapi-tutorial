const getProducts = async (request, h) => {
    return [
        { name: 'Broomstick' },
        { name: 'Nuke' },
        { name: 'Immortality' }
    ];
};

module.exports = {
    getProducts,

};
