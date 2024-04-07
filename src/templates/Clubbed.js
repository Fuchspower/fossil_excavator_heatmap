import Template from "../classes/Template"

const Clubbed = {
    ...Template,
    name: "Clubbed",
    height: 4,
    width: 8,
    spots: [
        {x:1, y:1},
        {x:1, y:2},
        {x:2, y:1},
        {x:2, y:2},
        {x:3, y:3},
        {x:4, y:4},
        {x:5, y:4},
        {x:6, y:4},
        {x:7, y:4},
        {x:7, y:2},
        {x:8, y:3}
    ],
    baseProbability: 0.125
}

export default Clubbed

/*
+-+-+-+-+-+-+-+-+
| | | |x|x|x|x| |
+-+-+-+-+-+-+-+-+
| | |x| | | | |x|
+-+-+-+-+-+-+-+-+
|x|x| | | | |x| |
+-+-+-+-+-+-+-+-+
|x|x| | | | | | |
+-+-+-+-+-+-+-+-+
*/