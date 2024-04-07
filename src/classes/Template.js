function isVerticalAxisSymmetric(spots, width) {
    let symmetric = true;
    for (let spot of spots) {
        if (!spots.some(sp => (sp.x === width - spot.x + 1) && sp.y === spot.y)){
            symmetric = false;
        }
    }
    return symmetric;
}

function isHorizontalAxisSymmetric(spots, height) {
    let symmetric = true;
    for (let spot of spots) {
        if (!spots.some(sp => (sp.x === spot.x) && sp.y === height - spot.y + 1)){
            symmetric = false;
        }
    }
    return symmetric;
}

function isPointSymmetric(spots, height, width){
    let symmetric = true;
    for (let spot of spots) {
        if (!spots.some(sp => (sp.x === width - spot.x + 1) && (sp.y === height - spot.y + 1))){
            symmetric = false;
        }
    }
    return symmetric;
}

function isOrthogonal(spots, height){
    let symmetric = true;
    for (let spot of spots) {
        if (!spots.some(sp => sp.x === spot.y && sp.y === spot.x)){
            symmetric = false;
        }
    }
    return symmetric;
}

const Template = {
    name: "",
    height: 0, // height <= width always
    width: 0,
    gridHeight: 0,
    gridWidth: 0,
    spots: [], // elements: {x, y}
    baseProbability: 0
    totalSpots: function() {
        return this.spots.length;
    },
    baseProbability: function() {
        return Math.round(100 / this.totalSpots()) / 100;
    },
    allIsometrics: function() {
        let isometrics = [];
        if (this.height <= this.gridHeight && this.width <= this.gridWidth){
            isometrics = [...isometrics, this];
        }
        if(!(this.height === this.width && isOrthogonal(this.spots, this.width)) && this.height <= this.gridWidth && this.width <= this.gridHeight){
            isometrics = [...isometrics, this.rotate90()]
        }
        isometrics = isometrics.flatMap(temp => {return isHorizontalAxisSymmetric(temp.spots, temp.height) ? [temp] : [temp, temp.mirrorVertically()]})
        isometrics = isometrics.flatMap(temp => {return (isVerticalAxisSymmetric(temp.spots, temp.width) || isPointSymmetric(temp.spots, temp.height, temp.width))  ? [temp] : [temp, temp.mirrorHorizontally()]})
        return isometrics;
    },
    rotate90: function() {
        const rotatedFigure = {...this, height: this.width, width: this.height, spots: []};
        this.spots.map((cell) => {
            rotatedFigure.spots = [...rotatedFigure.spots, {x: cell.y, y: cell.x}];
        })
        return rotatedFigure;
    },
    mirrorHorizontally: function() {
        const mirroredFigure = {...this, spots: []};
        this.spots.map((cell) => {
            mirroredFigure.spots= [...mirroredFigure.spots, {x: this.width - cell.x + 1, y: cell.y}];
        })
        return mirroredFigure;
    },
    mirrorVertically: function() {
        const mirroredFigure = {...this, spots: []};
        this.spots.map((cell) => {
            mirroredFigure.spots= [...mirroredFigure.spots, {x: cell.x, y: this.height - cell.y + 1}];
        })
        return mirroredFigure;
    }
};

export default Template