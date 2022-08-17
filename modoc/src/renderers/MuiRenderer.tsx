import RenderParser from "../renderParser";
import React from "react";
import { AllRenderItems } from "../types";
import { RenderGroupItem } from "../types/renderTypes";

export default class MuiRenderParser extends RenderParser {
    public SELF_CONSTRUCTOR: typeof RenderParser = MuiRenderParser;
    public renderers: {
        [key: string]: (children: JSX.Element[], object: any) => JSX.Element;
    } = {
        group: this.renderGroup
    };

    public renderGroup(
        children: JSX.Element[],
        object: RenderGroupItem
    ): JSX.Element {
        return <div className="modoc_mui-group">{children}</div>;
    }
}
