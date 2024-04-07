import Template from "../classes/Template"

const Footprint = {
    ...Template,
    name: "Footprint",
    height: 5,
    width: 5,
    spots: [
        {x:1, y:1},
        {x:1, y:2},
        {x:2, y:3},
        {x:2, y:4},
        {x:3, y:1},
        {x:3, y:2},
        {x:3, y:3},
        {x:3, y:4},
        {x:3, y:5},
        {x:4, y:3},
        {x:4, y:4},
        {x:5, y:1},
        {x:5, y:2}
    ],
    baseProbability: 0.125
}

export default Footprint

/*
+-+-+-+-+-+
| | |x| | |
+-+-+-+-+-+
| |x|x|x| |
+-+-+-+-+-+
| |x|x|x| |
+-+-+-+-+-+
|x| |x| |x|
+-+-+-+-+-+
|x| |x| |x|
+-+-+-+-+-+
*/