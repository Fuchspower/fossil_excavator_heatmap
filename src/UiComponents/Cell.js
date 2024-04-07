import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as utils from "../Utils";

class Cell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            color: props.initialColor,
            percentage: props.initialPercentage
        };
    }

    handleClick = (e) => {
        this.props.state.updateState(this.props.row, this.props.column, true)
    }

    handleMouseOver = (e) => {
        this.setState({color: utils.getBlueHue(this.props.state.field[23].weight / this.props.state.maxWeight(), true)})
    }

    handleMouseOut = (e) => {
            this.setState({color: utils.getBlueHue(this.props.state.field[23].weight / this.props.state.maxWeight(), false)})
    }

    render() {
        return (
            <Group
                x = {this.props.x}
                y = {this.props.y}
                height = {this.props.height}
                width = {this.props.width}
                onMouseOver = {this.handleMouseOver}
                onMouseOut = {this.handleMouseOut}
                onClick = {this.handleClick}
            >
                <Rect
                    height = {this.props.height}
                    width = {this.props.width}
                    fill = {this.state.color}
                />
                <Text
                    height = {this.props.height}
                    width = {this.props.width}
                    text = {this.state.percentage}
                />
            </Group>
        );
    }
}

export default Cell;