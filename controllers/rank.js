export const handleRank = (req, res, db) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('rank', 1)
        .returning('rank')
        .then(rank => {
            res.json(rank[0])
        })
        .catch(error => res.status(400).json('unable to get rank'))
}