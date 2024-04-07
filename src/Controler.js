return (<Stage width={window.innerWidth} height={window.innerHeight} onContextMenu = {(e) => {
                                                                                 e.evt.preventDefault()}}>
                <Layer>
                    <Cell
                        x = {30}
                        y = {60}
                        initialColor = {utils.getBlueHue(state.field[23].weight / state.maxWeight(), false)}
                        initialPercentage = {state.field[23].weight / state.totalWeight}
                        height = {60}
                        width = {60}
                        state = {state}
                        row = {3}
                        column = {6}
                    />
            </Layer>
    </Stage>)