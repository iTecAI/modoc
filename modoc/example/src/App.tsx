import React from 'react'
import { ModularRenderer, MuiRenderParser } from "../../dist";
import "modoc/dist/index.css";
import * as wrp_data from "./data/wrp.json";
import * as ren_class from "./data/class_renderer.json";

const App = () => {
    return (
        <ModularRenderer
            data={wrp_data[0]}
            renderer={ren_class}
            parser={MuiRenderParser}
        />
    );
};

export default App
