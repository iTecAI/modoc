import {
    RenderGroupItem,
    RenderTextItem,
    RenderDividerItem
} from "./renderTypes";
import { ListSourceItem, GeneratorSourceItem } from "./sourceTypes";

export type AllRenderItems =
    | RenderGroupItem
    | RenderTextItem
    | RenderDividerItem;
export type AllSourceItems = ListSourceItem | GeneratorSourceItem;
