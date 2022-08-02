import { SourceItem, ParsedFunction, RenderItem } from "./types";

export interface ListSourceItem extends SourceItem {
    type: "list";
    /**
     * Dot path to an array value in the data (ie. i.am.a.path.to.an.array)
     * @type {string}
     */
    source: string;
    renderer: RenderItem;
}

export interface GeneratorSourceItem extends SourceItem {
    type: "generator";
    /**
     * A function that takes data and outputs an array of {[key: string]: Literal | ValueItem}
     * @type {string}
     */
    function: ParsedFunction;
    renderer: RenderItem;
}

type AllSourceItems = ListSourceItem | GeneratorSourceItem;
export default AllSourceItems;
