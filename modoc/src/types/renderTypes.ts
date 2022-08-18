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

export type RenderChipItem = {
    supertype: "render";
    type: "chip";
    text: ValueItem;
    avatar?:
        | {
              type: "icon";
              name: string;
          }
        | {
              type: "text";
              text: ValueItem;
          }
        | {
              type: "image";
              source: ValueItem;
              alt: ValueItem;
          };
};

export type RenderStackItem = {
    supertype: "render";
    type: "stack";
    direction: "horizontal" | "vertical";
    spacing: number;
    children: AllRenderItems[] | AllSourceItems;
};

export type RenderListItem = {
    supertype: "render";
    type: "list";
    itemMarkers:
        | {
              ordered: true;
              style:
                  | "armenian"
                  | "cjk-ideographic"
                  | "decimal"
                  | "decimal-leading-zero"
                  | "georgian"
                  | "hebrew"
                  | "hiragana"
                  | "hiragana-iroha"
                  | "katakana"
                  | "katakana-iroha"
                  | "lower-alpha"
                  | "lower-greek"
                  | "lower-latin"
                  | "lower-roman"
                  | "upper-alpha"
                  | "upper-greek"
                  | "upper-latin"
                  | "upper-roman";
          }
        | {
              ordered: false;
              style: "circle" | "disc" | "square";
          };
    children: AllRenderItems[] | AllSourceItems;
};

export type RenderTableItem = {
    supertype: "render";
    type: "table";
    title?: ValueItem;
    headers: AllRenderItems[] | AllSourceItems;
    rows: RenderTableRowItem[] | AllSourceItems<RenderTableRowItem>;
};

export type RenderTableRowItem = {
    supertype: "render";
    type: "tableRow";
    cells: AllRenderItems[] | AllSourceItems;
};
