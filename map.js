class Map {
    getNumericPosition(pos) {
        return [
            7 - parseInt(pos[1]) + 1,
            'abcdefg'.indexOf(pos[0].toLowerCase())
        ]
    }
    getAlphaPosition(pos) {
        return 'ABCDEFG'[pos[1]]+ (8 - pos[0]).toString()
    }
}

module.exports = new Map()