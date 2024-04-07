import Template from "../classes/Template"

const Webbed = {
    ...Template,
    name: "Webbed",
    height: 4,
    width: 7,
    spots: [
        {x:1, y:3},
        {x:2, y:2},
        {x:3, y:1},
        {x:4, y:1},
        {x:4, y:2},
        {x:4, y:3},
        {x:4, y:4},
        {x:5, y:1},
        {x:6, y:2},
        {x:7, y:3}
    ],
    baseProbability: 0.125
}

export default Webbed

/*
+-+-+-+-+-+-+-+
| | | |x| | | |
+-+-+-+-+-+-+-+
|x| | |x| | |x|
+-+-+-+-+-+-+-+
| |x| |x| |x| |
+-+-+-+-+-+-+-+
| | |x|x|x| | |
+-+-+-+-+-+-+-+
*/