import Template from "../classes/Template"

const Tusk = {
    ...Template,
    name: "Tusk",
    height: 5,
    width: 5,
    spots: [
        {x:1, y:3},
        {x:2, y:2},
        {x:2, y:4},
        {x:3, y:1},
        {x:3, y:5},
        {x:4, y:1},
        {x:4, y:4},
        {x:5, y:1}
    ],
    baseProbability: 0.125
}

export default Tusk

/*
+-+-+-+-+-+
| | |x| | |
+-+-+-+-+-+
| |x| |x| |
+-+-+-+-+-+
|x| | | | |
+-+-+-+-+-+
| |x| | | |
+-+-+-+-+-+
| | |x|x|x|
+-+-+-+-+-+
*/