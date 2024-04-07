import Template from "../classes/Template"

const Claw = {
    ...Template,
    name: "Claw",
    height: 5,
    width: 6,
    spots: [
        {x:1, y:4},
        {x:2, y:5},
        {x:2, y:4},
        {x:2, y:3},
        {x:2, y:2},
        {x:3, y:4},
        {x:3, y:3},
        {x:3, y:1},
        {x:4, y:4},
        {x:4, y:2},
        {x:5, y:3},
        {x:5, y:1},
        {x:6, y:2}
    ],
    baseProbability: 0.125
}

export default Claw

/*
+-+-+-+-+-+-+
| |x| | | | |
+-+-+-+-+-+-+
|x|x|x|x| | |
+-+-+-+-+-+-+
| |x|x| |x| |
+-+-+-+-+-+-+
| |x| |x| |x|
+-+-+-+-+-+-+
| | |x| |x| |
+-+-+-+-+-+-+

*/