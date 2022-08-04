import RenderParser from "../renderParser";
import React from "react";

export default class MuiRenderParser extends RenderParser {
    public SELF_CONSTRUCTOR: typeof RenderParser = MuiRenderParser;
    public renderers: {
        [key: string]: (children: JSX.Element[]) => JSX.Element;
    } = {
        group: this.renderGroup
    };

    public renderGroup(children: JSX.Element[]): JSX.Element {
        return <div className="modoc_mui-group">{children}</div>;
    }
}
