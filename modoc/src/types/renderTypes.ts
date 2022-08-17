import { ParsedFunction, ValueItem, AllSourceItems, AllRenderItems } from ".";

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
    textType:
        | "body1"
        | "body2"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "subtitle1"
        | "subtitle2";
    style: ("italic" | "bold" | "strikethrough" | "underline")[];
    conditionalRender?: ParsedFunction;
};

export type RenderDividerItem = {
    supertype: "render";
    type: "divider";
    child?: AllRenderItems;
    variant: "full" | "inset" | "middle";
    conditionalRender?: ParsedFunction;
};
