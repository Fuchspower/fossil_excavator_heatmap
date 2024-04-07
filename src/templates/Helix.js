import Template from "../classes/Template"

const Helix = {
    ...Template,
    name: "Helix",
    height: 4,
    width: 5,
    spots: [
        {x:1, y:1},
        {x:1, y:2},
        {x:1, y:3},
        {x:1, y:4},
        {x:2, y:1},
        {x:2, y:4},
        {x:3, y:1},
        {x:3, y:3},
        {x:3, y:4},
        {x:4, y:1},
        {x:5, y:1},
        {x:5, y:2},
        {x:5, y:3},
        {x:5, y:4}
    ],
    baseProbability: 0.125
}

export default Helix

/*
+-+-+-+-+-+
|x|x|x| |x|
+-+-+-+-+-+
|x| |x| |x|
+-+-+-+-+-+
|x| | | |x|
+-+-+-+-+-+
|x|x|x|x|x|
+-+-+-+-+-+
*/