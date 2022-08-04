import { AllSourceItems, AllRenderItems } from ".";
import { ParsedFunction, ValueItem } from "./types";

export type RenderGroupItem = {
    supertype: "render";
    type: "group";
    conditionalRender?: ParsedFunction;
    children: AllRenderItems[] | AllSourceItems;
};

export type RenderTextItem = {
    supertype: "render";
    type: "text";
    text: ValueItem;
    conditionalRender?: ParsedFunction;
};

export type RenderDividerItem = {
    supertype: "render";
    type: "divider";
    child: AllRenderItems;
    conditionalRender?: ParsedFunction;
};
