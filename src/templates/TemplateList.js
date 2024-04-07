import Claw from "./Claw.js"
import Clubbed from "./Clubbed.js"
import Footprint from "./Footprint.js"
import Helix from "./Helix.js"
import Spine from "./Spine.js"
import Tusk from "./Tusk.js"
import Ugly from "./Ugly.js"
import Webbed from "./Webbed.js"

function TemplateList(height, width) {
    let ret = [Claw, Clubbed, Footprint, Helix, Spine, Tusk, Ugly, Webbed];
    ret = ret.map(temp => {return {...temp, gridHeight: height, gridWidth: width}})
    return ret
}

export default TemplateList