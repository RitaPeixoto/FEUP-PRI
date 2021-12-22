async function test(req, res) {
    return res.status(200).json({ message: 'Hello from Backend' });
}

module.exports = {
    test,
};
