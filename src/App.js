import { createRoot } from 'react-dom/client';
import Canvas from "./Canvas"
import State from "./classes/State"
import TemplateList from "./templates/TemplateList"
import Cell from "./UiComponents/Cell"
import { Stage, Layer, Group, Rect, Text, Line, Circle } from 'react-konva';
import * as utils from "./Utils";

const state = {...State, height: 6, width: 9, templates: TemplateList(6, 9)}
state.initField();
state.resetState();

function App() {

    return <Canvas/>;


}

export default App;