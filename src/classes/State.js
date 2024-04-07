import Pattern from "./Pattern"
import * as utils from "../Utils"

const State = {
    height: 0,
    width: 0,
    templates: [],
    possibleTemplates: [],
    field: [],
    activePatterns: [],
    totalWeight: 0,
    uncoveredFossilSpots: 0,
    changeHistory: [],
    maxWeight: function() {
        let maximum = 0;
        for (let cell of this.field) {
            if (cell.weight > maximum && !cell.uncovered) {
                maximum = cell.weight;
            }
        }
        return maximum
    },
    initField: function() {
        for (let i=1; i <= this.width * this.height; i++) {
                this.field= [ ...this.field, {weight: 0, uncovered: false, fossil: false}];
            }
    },
    resetState: function() {
        this.uncoveredFossilSpots = 0;
        this.resetField();
        this.resetPatterns();
        this.applyPatterns();
        this.calculatePossibleTemplates();
        this.changeHistory = [];
    },
    resetField: function() {
        for (let i=0; i < this.field.length; i++) {
            this.field[i]= {weight: 0, uncovered: false, fossil: false};
        }
    },
    resetFieldWeight: function() {
        for (let i=0; i < this.field.length; i++) {
            this.field[i].weight = 0;
        }

    },
    resetPatterns: function() {
        this.activePatterns= [];
        let patternLcm = 1;
        let templateOptions = [];
        for (let template of this.templates) {
            let possiblePlacements = 0;
            const currentIsometrics = template.allIsometrics();
            for (let temp of currentIsometrics) {
                const newPattern = {...Pattern, height: this.height, width: this.width, baseTemplate: temp};
                const newPatterns = newPattern.createPatternsFromTemplate();
                possiblePlacements = possiblePlacements + newPatterns.length;
                this.activePatterns= [...this.activePatterns, ...newPatterns];
            }
            templateOptions = [...templateOptions, {name: template.name, options: possiblePlacements}]
            patternLcm = utils.lcm(patternLcm, possiblePlacements);
        }
        for (let pattern of this.activePatterns) {
            for (let option of templateOptions) {
                if (option.name == pattern.baseTemplate.name){
                    pattern.weight = patternLcm / option.options;
                }
            }
        }
    },
    applyPatterns: function() {
        this.totalWeight = 0;
        this.resetFieldWeight();
        for (let pattern of this.activePatterns) {
            this.totalWeight += pattern.weight;
            for (let spot of pattern.spots) {
                const index = spot.x + (spot.y-1) * this.width - 1;
                this.field[index].weight += pattern.weight;
            }
        }
    },
    updateState: function(x, y, fossilFound) {
        if (this.field[this.width * (y-1) + x-1].uncovered === true){
            return
        }
        this.uncoveredFossilSpots += fossilFound ? 1 : 0;
        this.field[this.width * (y-1) + x-1].uncovered = true
        this.field[this.width * (y-1) + x-1].fossil = fossilFound
        this.updatePatterns(x,y,fossilFound);
        this.applyPatterns();
        this.calculatePossibleTemplates();
    },
    updatePatterns: function(x, y, fossilFound) {
        let removedPatterns = [];
        for (let pattern of this.activePatterns) {
            let keepPattern = !fossilFound;
            for (let spot of pattern.spots) {
                if (spot.x === x && spot.y === y) {
                    keepPattern = !keepPattern;
                    break;
                }
            }
            if (!keepPattern) {
                removedPatterns = [...removedPatterns, pattern];
            }
        }
        for (let pattern of removedPatterns) {
            this.activePatterns = this.activePatterns.filter((pat) => pat !== pattern);
        }
        this.changeHistory = [{type:"uncover", field:{x: x, y: y}, removedPatterns: removedPatterns}, ...this.changeHistory];
    },
    calculatePossibleTemplates: function() {
        this.possibleTemplates = this.templates.map(temp => {return {name: temp.name, weight: 0, spots: temp.totalSpots()}})
        for (let pattern of this.activePatterns) {
            this.possibleTemplates = this.possibleTemplates.map(temp => {return {...temp, weight: (temp.weight + ((temp.name === pattern.baseTemplate.name) ? pattern.weight : 0))}});
        }
        this.possibleTemplates.sort((a,b) => b.weight - a.weight);
    },
    inputNumberOfFossilSpots: function(name) {
        let removedPatterns = [];
        for (let pattern of this.activePatterns) {
            if (pattern.baseTemplate.totalSpots() !== name){
                removedPatterns = [...removedPatterns, pattern];
            }
        }
        for (let pattern of removedPatterns) {
            this.activePatterns = this.activePatterns.filter((pat) => pat !== pattern);
        }
        this.changeHistory = [{type:"numberOfSpots", field:{}, removedPatterns: removedPatterns}, ...this.changeHistory];
        this.applyPatterns();
        this.calculatePossibleTemplates();
    },
    undo: function(name) {
        if (!this.changeHistory.length){
            return
        }
        this.activePatterns = [...this.activePatterns, ...this.changeHistory[0].removedPatterns]
        if (this.changeHistory[0].type === "uncover") {
            this.field[this.changeHistory[0].field.x - 1 + this.width * (this.changeHistory[0].field.y - 1)].uncovered = false;
            if (this.field[this.changeHistory[0].field.x - 1 + this.width * (this.changeHistory[0].field.y - 1)].fossil) {
                this.uncoveredFossilSpots--
            }
        }
        this.changeHistory = this.changeHistory.slice(1);
        this.applyPatterns();
        this.calculatePossibleTemplates();
    }
}

export default State