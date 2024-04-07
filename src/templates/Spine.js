import Template from "../classes/Template"

const Spine = {
    ...Template,
    name: "Spine",
    height: 3,
    width: 6,
    spots: [
        {x:1, y:1},
        {x:2, y:1},
        {x:2, y:2},
        {x:3, y:1},
        {x:3, y:2},
        {x:3, y:3},
        {x:4, y:1},
        {x:4, y:2},
        {x:4, y:3},
        {x:5, y:1},
        {x:5, y:2},
        {x:6, y:1}
    ],
    baseProbability: 0.125
}

export default Spine

/*
+-+-+-+-+-+-+
| | |x|x| | |
+-+-+-+-+-+-+
| |x|x|x|x| |
+-+-+-+-+-+-+
|x|x|x|x|x|x|
+-+-+-+-+-+-+
*/