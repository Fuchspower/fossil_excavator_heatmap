import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Group, Rect, Text, Line, Circle, Arrow } from 'react-konva';
import State from './classes/State'
import TemplateList from "./templates/TemplateList"

const height = 6;
const width = 9;
const squareWidth = Math.round(window.innerHeight / 11);

function getCoordinatesByIndex(index){
    return {x: index % state.width + 1, y: Math.floor(index / state.width) + 1}
}

function getIndexByCoordinates(x, y){
    return (y - 1) * state.width + x - 1;
}

function getRectangleColor(index, highlight) {
    const maxWeightOfField = state.maxWeight();
    const cell = state.field[index];
    if (cell.uncovered) {
        if (cell.fossil) {
            return "green"
        } else {
            return "red"
        }
    } else if (cell.weight === 0) {
        return highlight ? "#CCCCCC" : "#AAAAAA"
    }
    else {
        let ret = ("#" + ((highlight ? 0.8 : 1) * 255 * cell.weight / maxWeightOfField > 239.5 ? "0" : "") + (255 - Math.round(255 * (highlight ? 0.8 : 1) * cell.weight / maxWeightOfField)).toString(16) + ((highlight ? 0.8 : 1) * 255 * cell.weight / maxWeightOfField > 239.5 ? "0" : "") + (255 - Math.round(255 * (highlight ? 0.8 : 1) * cell.weight / maxWeightOfField)).toString(16) + "FF")
        console.log((highlight ? 0.8 : 1) * 255 * cell.weight / maxWeightOfField)
        console.log("index: " + index + " color: " + ret)
        return ret
    }
}

const state = {...State, height: height, width: width, templates: TemplateList(height, width)}
state.initField();
state.resetState();
console.log("activePatterns: " + state.activePatterns.length)

const possibleNumbersOfFossilSpots = Array.from(new Set(state.templates.map(template => {return template.totalSpots()}))).sort((a,b) => a - b)
const probabilityRefs = {};
for (let number of possibleNumbersOfFossilSpots) {
    probabilityRefs[number] = React.createRef(null);
}

function cellData() {return [...Array(state.height * state.width)].map((_, i) => ({
    id: Number(i),
    x: squareWidth * (.25 + getCoordinatesByIndex(i).x - 1),
    y: squareWidth + squareWidth * (getCoordinatesByIndex(i).y - 1),
    hasHighestProbability: state.maxWeight() === state.field[i].weight,
    percentage: Math.floor(1000 * state.field[i].weight / state.totalWeight)/10 + "%",
    displayPercentage: !(state.field[i].weight === 0 || state.field[i].uncovered),
    highlightedSquare: false,
    cellColor: function() {return getRectangleColor(this.id, this.highlightedSquare)},
}))};

const templateRefs = {};
const templateTextRefs = {};

for (let temp of state.templates) {
    templateRefs[temp.name] = React.createRef(null);
    templateTextRefs[temp.name] = React.createRef(null);
};

function updateTemplates() {
    state.possibleTemplates.map((template, i)  => {
        const group = templateRefs[template.name].current;
        const text = templateTextRefs[template.name].current
        text.setAttr("text", Math.floor(1000 * template.weight / state.totalWeight) / 10 + "%");
        group.to({
            x: squareWidth * (.5 + state.width + Math.floor(i / 4) * 3.25),
            y: template.weight === 0 ? window.innerHeight + .25 * squareWidth : squareWidth * (2.25 * (i % 4) + 1),
            duration: .5
        })
    })
}

function getPercentageForTemplate(template){
    let weight = 0;
    for (let temp of state.possibleTemplates) {
        if (temp.name === template.name) {weight = temp.weight;}
    }
    return Math.floor(1000 * weight / state.totalWeight) / 10
}

function templatesData() {return state.templates.map((template, i) => ({
    name: template.name,
    ref: templateRefs[template.name],
    x: 30 + squareWidth * state.width + Math.floor(i / 4) * (3 * squareWidth + 20),
    y: function() {return this.weight() === 0 ? window.innerHeight + .25 * squareWidth: squareWidth * (2.5 * (i % 4) + 1)},
    spots: template.spots,
    weight: function() {let weight = 0;
                        for (let temp of state.possibleTemplates) {
                            if (temp.name === template.name) {weight = temp.weight;}
                        }
                        return weight},
    percentage: function() {
        return Math.floor(1000 * this.weight() / state.totalWeight) / 10 + "%";
    }
}))};

function probabilityText(number) {
    return "Fossil Progress\nBase:\t" + Math.round(1000 * 1 / number)/10 + "%\nCurrent:\t" + Math.round(1000 * state.uncoveredFossilSpots / number)/10 + "%\nTotal Spots:\t" + number
}

function moveProbabilitiesBack(){
    possibleNumbersOfFossilSpots.map((number, i) => {
        const group = probabilityRefs[number].current;
        group.to({y: .25 * squareWidth + window.innerHeight + 4 / 3 * Math.floor(i / 4) * squareWidth, duration: .5})
        group.to({
            x: 10 + (i % 4) * 7 / 3 * squareWidth,
            y: .25 * squareWidth + window.innerHeight + 4 / 3 * Math.floor(i / 4) * squareWidth,
            duration: .5
        })
    })
}

function rearrangeProbabilities(){
    let orderedProbabilities = []
    for (let temp of state.possibleTemplates) {
        if (orderedProbabilities.some((prob) => prob.spots === temp.spots)) {
            orderedProbabilities = orderedProbabilities.map((prob) => {return {...prob, weight: prob.spots === temp.spots ? prob.weight + temp.weight : prob.weight}})
        } else {
            orderedProbabilities = [...orderedProbabilities, {spots: temp.spots, weight: temp.weight}]
        }
    }
    orderedProbabilities.sort((a,b) => b.weight - a.weight);
    console.log(orderedProbabilities)
    orderedProbabilities.map((prob, index) => {
        const group = probabilityRefs[prob.spots].current;
        if (prob.weight > 0) {
            group.to({x: squareWidth * (.25 + (index % 4) * 7 / 3), y: (state.height + 1.25 + 4 / 3 * Math.floor(index / 4)) * squareWidth, duration: .5})
        } else {
            group.to({y: window.innerHeight + squareWidth, duration: .5})
            group.to({
                x: 10 + (index % 4) * 7 / 3 * squareWidth,
                y: .25 * squareWidth + window.innerHeight + 4 / 3 * Math.floor(index / 4) * squareWidth,
                duration: .5
            })
        }
    })
}

const Canvas = () => {
    const blurRectRef = React.useRef(null);
    const infoGroupRef = React.useRef(null);
    const helpGroupRef = React.useRef(null);

    const [cells, setCells] = React.useState(cellData);
    const handleMouseOver = (e) => {
        const id = Number(e.target.name());
        setCells(cells.map(cell => {return {...cell, highlightedSquare: cell.id === id}}));
    }
    const handleMouseOut = (e) => {
        const id = Number(e.target.name());
        setCells(cellData);
    }

    const handleClick = (e) => {
        const id = Number(e.target.name());
        if (e.evt.button === 0) {
            state.updateState(getCoordinatesByIndex(id).x, getCoordinatesByIndex(id).y, true);
            possibleNumbersOfFossilSpots.map((number, i) => {
                for (let possTemp of state.possibleTemplates) {
                    for (let temp of state.templates){
                        if (possTemp.name === temp.name && number === temp.totalSpots()){
                            const group = probabilityRefs[number].current;
                            if (possTemp.weight > 0){
                                if (state.uncoveredFossilSpots === 1) {
                                   group.to({y: (state.height + 1.25 + 4 / 3 * Math.floor(i / 4)) * squareWidth, duration: .5})
                                }
                            } else {
                                group.to({y: .25 * squareWidth + window.innerHeight + 4 / 3 * Math.floor(i / 4) * squareWidth, duration: .5});
            }}}}})

        } else if (e.evt.button === 2) {
            state.updateState(getCoordinatesByIndex(id).x, getCoordinatesByIndex(id).y, false);
        }
        updateTemplates();
        setCells(cellData);
        rearrangeProbabilities();
    }

    const handleProbabilityClick = (e) => {
        const name = Number(e.target.name());
        possibleNumbersOfFossilSpots.map((number, i) => {
            const group = probabilityRefs[number].current;
            if (number === name) {
                group.to({x: .25 * squareWidth, y: (1.25 + state.height) * squareWidth, duration: .5}) ;
            } else{
                group.to({y: .25 * squareWidth + window.innerHeight + 4 / 3 * Math.floor(i / 4) * squareWidth, duration: .5})
            }
        })
        state.inputNumberOfFossilSpots(name);
        updateTemplates();
        setCells(cellData);
        rearrangeProbabilities();
    }

    return (
    <Stage width={window.innerWidth} height={window.innerHeight} onContextMenu = {(e) => {
                                                                     e.evt.preventDefault()}}>
        <Layer>
            {cells.map((cell) =>
                <Rect
                    x = {cell.x}
                    y = {cell.y}
                    height = {squareWidth}
                    width = {squareWidth}
                    fill = {cell.cellColor()}
                    stroke = {cell.hasHighestProbability && !(cell.cellColor() == "green" || cell.cellColor() == "red") ? "red" : ""}
                    strokeWidth = {cell.hasHighestProbability ? 3 : 0}
                    name = {cell.id.toString()}
                    onMouseOver = {handleMouseOver}
                    onMouseOut = {handleMouseOut}
                    onClick = {handleClick}
                />
            )}
            {cells.map((cell) =>
                <Text
                    text={cell.displayPercentage ? cell.percentage : ""}
                    fontSize={Math.round(squareWidth / 4)}
                    x={cell.x}
                    y={cell.y}
                    fill = {cell.hasHighestProbability ? "red" : "white"}
                    stroke = "black"
                    strokeWidth = {4}
                    fillAfterStrokeEnabled={true}
                    width = {squareWidth}
                    height = {squareWidth}
                    align = "center"
                    verticalAlign="middle"
                    name={cell.id.toString()}
                    onMouseOver = {handleMouseOver}
                    onMouseOut = {handleMouseOut}
                    onClick = {handleClick}
                />
            )}
            {[...Array(state.width + 1)].map((x, i) =>
                <Line
                    x={0}
                    y={0}
                    points={[squareWidth * (i + .25), squareWidth, squareWidth * (i + .25), squareWidth + state.height * squareWidth]}
                    stroke="black"
                />
            )}
            {[...Array(state.height + 1)].map((x, i) =>
                <Line
                    x={0}
                    y={0}
                    points={[.25 * squareWidth, squareWidth * (i + 1), (.25 + state.width) * squareWidth, squareWidth * (i + 1)]}
                    stroke="black"
                />
            )}
            {state.templates.map((template, i) =>
                <Group
                    x = {squareWidth * (state.width + .5) + Math.floor(i / 4) * (3 * squareWidth + .25 * squareWidth)}
                    y = {squareWidth * (2.25 * (i % 4) + 1)}
                    height = {2 * squareWidth}
                    width = {3 * squareWidth}
                    ref = {templateRefs[template.name]}
                >
                    <Rect
                        x = {0}
                        y = {0}
                        height = {2 * squareWidth}
                        width = {3 * squareWidth}
                        stroke = "black"
                        fill = "white"
                    />
                    <Text
                        text = {getPercentageForTemplate(template) + "%"}
                        x = {5}
                        y = {10}
                        ref = {templateTextRefs[template.name]}
                    />
                    <Text
                        text = {template.name}
                        x = {5}
                        y = {2 * squareWidth - 5}
                        height = {-10}
                        verticalAlign = "bottom"
                    />
                    {template.spots.map(spot =>
                        <Rect
                            x = {2.75 * squareWidth - (template.width - spot.x + 1) * 0.25 * squareWidth}
                            y = {squareWidth * (1 + .125 * template.height) - (spot.y) * 0.25 * squareWidth}
                            height = {0.25 * squareWidth}
                            width = {0.25 * squareWidth}
                            stroke = "black"
                            fill = "#AAAAAA"
                        />
                    )}
                </Group>
            )}
            { possibleNumbersOfFossilSpots.map((number, i) =>
                <Group
                    x = {squareWidth * (.25 + (i % 4) * 7 / 3)}
                    y = {.25 * squareWidth + window.innerHeight + 4 / 3 * Math.floor(i / 4) * squareWidth}
                    width = {2 * squareWidth}
                    height = {1 * squareWidth}
                    ref = {probabilityRefs[number]}
                    name = {number.toString()}
                    onClick = {handleProbabilityClick}
                    onMouseEnter={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                    }}
                >
                    <Rect
                        x = {0}
                        y = {0}
                        width = {2 * squareWidth}
                        height = {1 * squareWidth}
                        stroke = "black"
                        fill = "white"
                        name = {number.toString()}
                    />
                    <Text
                        x = {5}
                        y = {5}
                        text = {probabilityText(number)}
                        width = {2 * squareWidth}
                        lineHeight = {1.1}
                        name = {number.toString()}
                    />
                </Group>
            )}
            <Group
                x = {2.6 * squareWidth}
                y = {.25 * squareWidth}
            >
                <Text
                    x = {0}
                    y = {0}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    text = "?"
                    fontSize = {26}
                    align = "center"
                    verticalAlign = "middle"
                />
                <Circle
                    x = {.25 * squareWidth}
                    y = {.25 * squareWidth}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    stroke = "black"
                    strokeWidth = {1.5}
                    onMouseEnter={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                    }}
                    onClick = {e => {const rect = blurRectRef.current; rect.show(); const group = helpGroupRef.current; group.to({y: .2 * window.innerHeight, duration: .5})}}
                />
            </Group>
            <Group
                x = {1.9 * squareWidth}
                y = {.25 * squareWidth}
            >
                <Text
                    x = {0}
                    y = {0}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    text = "i"
                    fontFamily = "Times New Roman"
                    fontSize = {26}
                    align = "center"
                    verticalAlign = "middle"
                />
                <Circle
                    x = {.25 * squareWidth}
                    y = {.25 * squareWidth}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    stroke = "black"
                    strokeWidth = {1.5}
                    onMouseEnter={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                    }}
                    onClick = {e => {const rect = blurRectRef.current; rect.show(); const group = infoGroupRef.current; group.to({y: .2 * window.innerHeight, duration: .5})}}
                />
            </Group>
            <Group
                x = {1.2 * squareWidth}
                y = {.25 * squareWidth}
            >
                <Text
                    x = {0}
                    y = {0}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    text = "⭮"
                    fontSize = {26}
                    align = "center"
                    verticalAlign = "middle"
                />
                <Circle
                    x = {.25 * squareWidth}
                    y = {.25 * squareWidth}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    stroke = "black"
                    strokeWidth = {1.5}
                    onMouseEnter={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                    }}
                    onClick = {e =>
                        {state.resetState();
                        updateTemplates();
                        setCells(cellData);
                        moveProbabilitiesBack();
                    }}
                />
            </Group>
            <Group
                x = {.5 * squareWidth}
                y = {.25 * squareWidth}
            >
                <Arrow
                      points={[.375 * squareWidth, .25 * squareWidth, .125 * squareWidth, .25 * squareWidth]}
                      stroke = "black"
                      fill = "black"
                      pointerLength = {.0625 * squareWidth}
                      pointerWidth = {.1 * squareWidth}
                />
                <Circle
                    x = {.25 * squareWidth}
                    y = {.25 * squareWidth}
                    height = {.5 * squareWidth}
                    width = {.5 * squareWidth}
                    stroke = "black"
                    strokeWidth = {1.5}
                    onMouseEnter={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                    }}
                    onClick = {e => {
                            if (!state.changeHistory.length){
                                return
                            }
                            if (state.changeHistory[0].type === "numberOfSpots") {
                            possibleNumbersOfFossilSpots.map((number, i) => {
                                const group = probabilityRefs[number].current;
                                group.to({x: squareWidth * (.25 + (i % 4) * 7 / 3), y: (state.height + 1.25 + 4 / 3 * Math.floor(i / 4)) * squareWidth, duration: .5});
                            })
                        }
                        state.undo();
                        if (state.uncoveredFossilSpots === 0) {
                            moveProbabilitiesBack();
                        }
                        updateTemplates();
                        setCells(cellData);
                        rearrangeProbabilities()
                    }}
                />
            </Group>
            <Text
                x = {4.5 * squareWidth}
                y = {0}
                height = {squareWidth}
                width = {7 * squareWidth}
                align = "center"
                verticalAlign = "middle"
                text = "Fossil Excavator Heatmap"
                fontSize = {.4 * squareWidth}
            />
            <Rect
                x = {0}
                y = {0}
                height = {window.innerHeight}
                width = {window.innerWidth}
                fill = "#FFFFFF"
                opacity = {.80}
                ref = {blurRectRef}
                visible = {false}
                onClick = {e => {const infoGroup = infoGroupRef.current; infoGroup.to({y: -1 * window.innerHeight, duration: .5}); const helpGroup = helpGroupRef.current; helpGroup.to({y: -1 * window.innerHeight, duration: .5}); const rect = blurRectRef.current; rect.hide();}}
            />
            <Group
                ref={infoGroupRef}
                x = {.2 * window.innerWidth}
                y = {-1 * window.innerHeight}
                width = {.6 * window.innerWidth}
                height = {.6 * window.innerHeight}
            >
                <Rect
                    x = {0}
                    y = {0}
                    height = {.6 * window.innerHeight}
                    width = {.6 * window.innerWidth}
                    stroke = "black"
                    fill = "white"
                    strokeWidth = {0.8}
                />
                <Text
                    x = {.6 * window.innerWidth - 25}
                    y = {15}
                    height = {30}
                    width = {30}
                    stroke = "black"
                    text = "X"
                    onMouseEnter={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                    }}
                    onClick = {e => {const group = infoGroupRef.current; group.to({y: -1 * window.innerHeight, duration: .5}); const rect = blurRectRef.current; rect.hide();}}
                />
                <Text
                    x = {.2 * squareWidth}
                    y = {.25 * squareWidth}
                    width = {.6 * window.innerWidth}
                    fontSize = {Math.round(squareWidth / 5)}
                    text = {"Fossil Excavator Heatmap\n by Fuchspower\nMade with: React, React-Konva\nIssues? Bugs? Help? Contact me on Discord: fuchspower\n\nThis was just quickly made but works. Code refactoring is in progress.\n\nWhat to expect from refactoring?\n* Cleaner code that is less vulnerable\n* Better text formatting\n* Some new features like...\n   * communicating when fossil has been identified\n   * input chisel charges to see whether it makes sense to further excavate the fossil\n   * other strategies\n\n Remark: This works on the assumption that all fossils are equally distributed."}
                />
            </Group>
            <Group
               ref={helpGroupRef}
               x = {.2 * window.innerWidth}
               y = {-1 * window.innerHeight}
               width = {.6 * window.innerWidth}
               height = {.6 * window.innerHeight}
           >
               <Rect
                   x = {0}
                   y = {0}
                   height = {.6 * window.innerHeight}
                   width = {.6 * window.innerWidth}
                   stroke = "black"
                   fill = "white"
                   strokeWidth = {0.8}
               />
               <Text
                   x = {.6 * window.innerWidth - 25}
                   y = {15}
                   height = {30}
                   width = {30}
                   stroke = "black"
                   text = "X"
                   onMouseEnter={e => {
                       const container = e.target.getStage().container();
                       container.style.cursor = "pointer";
                   }}
                   onMouseLeave={e => {
                       const container = e.target.getStage().container();
                       container.style.cursor = "default";
                   }}
                   onClick = {e => {const group = helpGroupRef.current; group.to({y: -1 * window.innerHeight, duration: .5}); const rect = blurRectRef.current; rect.hide();}}
               />
               <Text
                   x = {.2 * squareWidth}
                   y = {.25 * squareWidth}
                   width = {.2 * window.innerWidth - 0.4 * squareWidth}
                   fontSize = {Math.round(squareWidth / 5)}
                   text = {"This grid shows you the probability of where a fossil could be hidden (on condition that there is a hidden fossil).\n\nClick on fields to match your current result.\nAfter uncovering a fossil part, click on the corresponding probability to narrow down possible fossils."}
               />
               <Line
                   points={[.2 * window.innerWidth, .2 * squareWidth, .2 * window.innerWidth, .6 * window.innerHeight - .2 * squareWidth]}
                   stroke="black"
                   strokeWidth = {0.8}
               />
               <Line
                   points = {[
                       .1 * window.innerWidth, .6 * window.innerHeight - .25 * squareWidth,
                       .1 * window.innerWidth + 1.1 * squareWidth, .6 * window.innerHeight - 2.25 * squareWidth,
                       .1 * window.innerWidth, .6 * window.innerHeight - 3.5 * squareWidth ,
                       .1 * window.innerWidth - 1.1 * squareWidth, .6 * window.innerHeight - 2.25 * squareWidth
                   ]}
                   lineCap = "round"
                   tension = {.8}
                   closed
                   stroke = "black"
               />
               <Line
                   points = {[.1 * window.innerWidth, .6 * window.innerHeight - 3.5 * squareWidth, .1 * window.innerWidth, .6 * window.innerHeight - 2.25 * squareWidth]}
                   stroke = "black"
               />
               <Line
                   points = {[
                       .1 * window.innerWidth - 1.1 * squareWidth, .6 * window.innerHeight - 2.25 * squareWidth,
                       .1 * window.innerWidth + 1.1 * squareWidth, .6 * window.innerHeight - 2.25 * squareWidth
                   ]}
                   stroke = "black"
               />
               <Line
                   points = {[
                       .1 * window.innerWidth - .55 * squareWidth, .6 * window.innerHeight - 2.9 * squareWidth,
                       .1 * window.innerWidth - .55 * squareWidth, .6 * window.innerHeight - 4.25 * squareWidth,
                       .1 * window.innerWidth - 1.75 * squareWidth, .6 * window.innerHeight - 4.25 * squareWidth
                   ]}
                   stroke = "black"
                   strokeWidth = {.9}
               />
               <Line
                   points = {[
                       .1 * window.innerWidth + .55 * squareWidth, .6 * window.innerHeight - 2.9 * squareWidth,
                       .1 * window.innerWidth + .55 * squareWidth, .6 * window.innerHeight - 4.25 * squareWidth,
                       .1 * window.innerWidth + 1.75 * squareWidth, .6 * window.innerHeight - 4.25 * squareWidth
                   ]}
                   stroke = "black"
                   strokeWidth = {.9}
               />
               <Text
                   x = {.1 * window.innerWidth - 1.4 * squareWidth}
                   y = {.6 * window.innerHeight - 4.55 * squareWidth}
                   width = {.8 * squareWidth}
                   height = {.25 * squareWidth}
                   text = {"Fossil"}
                   verticalAlign = {"middle"}
                   fontSize = {Math.round(squareWidth / 6)}
               />
               <Rect
                   x = {.1 * window.innerWidth - 1.7 * squareWidth}
                   y = {.6 * window.innerHeight - 4.55 * squareWidth}
                   height = {.25 * squareWidth}
                   width = {.25 * squareWidth}
                   fill = {"green"}
               />
               <Rect
                   x = {.1 * window.innerWidth + 1.45 * squareWidth}
                   y = {.6 * window.innerHeight - 4.55 * squareWidth}
                   height = {.25 * squareWidth}
                   width = {.25 * squareWidth}
                   fill = {"red"}
               />
               <Text
                   x = {.1 * window.innerWidth + .6 * squareWidth}
                   y = {.6 * window.innerHeight - 4.55 * squareWidth}
                   width = {.8 * squareWidth}
                   height = {.25 * squareWidth}
                   text = {"Non-Fossil"}
                   verticalAlign = {"middle"}
                   align = "right"
                   fontSize = {Math.round(squareWidth / 6)}
               />
               <Text
                   x = {.2 * window.innerWidth + .2 * squareWidth}
                   y = {.25 * squareWidth}
                   width = {.4 * window.innerWidth - .4 * squareWidth}
                   fontSize = {Math.round(squareWidth / 5)}
                   text = {"FAQ:\nWhat Gemstones should I put on my Chisel?\nIf you have the Perfect Chisel (22 Clicks), it should be possible to always fully uncover a fossil without any extra clicks, even at worst luck. If you have a lower tier Chisel, it is recommended to use Full Aquamarine (Extra Clicks).\nIf you are using Citrine (highlight cells with treasure), it can also show a fossil cell. However, if you always start with the highlightes cells (especially, if they have low percentage), there is a chance to fail to uncover a fossil completely.\nOnyx (extra treasure) is never a bad idea.\nPeridot (more Fossil Dust) seems pretty bad at the moment since the Dust Exchange is pretty empty at this moment. This might change, if there are some nice items added.\n\nWhat is a heatmap?\nA heatmap is a tool to visualize data on a 2-dimensional field, for example in order to show the most watched regions after having watched an Ad with an Eyetracker. The more a certain region was watched, the higher the heat and thus the stronger the associated color.\nIn this case, the solver creates patterns for each different Fossil type, including all rotations and possible shifts. Then, for each cell, it will count the patterns that have a fossil cell hidden in this cell. With this, it calculates a probability for each cell.\nIf a cell is clicked, the solver checks for each pattern whether the cell matched the result. If not, the pattern is removed and the possibilities are alltogether calculated again."}
               />
           </Group>
        </Layer>
    </Stage>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Canvas />);

export default Canvas;

