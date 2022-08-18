import { ModularRenderer, MuiRenderParser } from "modoc";
import wrp_data from "./data/wrp.json";
import ren_class from "./data/class.renderer.json";
import React from "react";

const App = () => {
    return (
        <ModularRenderer
            data={wrp_data[0]}
            renderer={ren_class as any}
            parser={MuiRenderParser}
        />
    );
};

export default App;
