import Template from "./Template"

const Pattern = {
    height: 0,
    width: 0,
    spots: [], // elements: {x, y}
    weight: 0,
    baseTemplate: {...Template},
    createPatternsFromTemplate: function() {
        this.weight= (this.width - this.baseTemplate.width)*(this.height - this.baseTemplate.height)
        let patternList = []
        for (let i = 0; i < this.width - this.baseTemplate.width + 1; i++){
            for (let j = 0; j < this.height - this.baseTemplate.height + 1; j++){
                const currentPattern = {...this};
                currentPattern.insertTemplate(i, j);
                patternList = [...patternList, currentPattern];

            }
        }
        return patternList;
    },
    insertTemplate: function(x, y) {
        this.baseTemplate.spots.map((spot) => {
            this.spots = [...this.spots, {x: x + spot.x, y: y + spot.y}];
            return null;
        }
        )
    }
}

export default Pattern