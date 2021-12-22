async function test(req, res) {
    console.log("oi");
    return res.status(200).json({ message: 'Hello from Backend' });
}

module.exports = {
    test,
};
