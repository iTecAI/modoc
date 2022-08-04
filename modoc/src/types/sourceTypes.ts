import AllRenderItems from "./renderTypes";
import { SourceItem, ParsedFunction } from "./types";

export interface ListSourceItem extends SourceItem {
    type: "list";
    /**
     * Dot path to an array value in the data (ie. i.am.a.path.to.an.array)
     * @type {string}
     */
    source: string;
    renderer: AllRenderItems;
}

export interface GeneratorSourceItem extends SourceItem {
    type: "generator";
    /**
     * A function that takes data and outputs an array of {[key: string]: ValueItem | {...}}
     * @type {string}
     */
    function: ParsedFunction;
    renderer: AllRenderItems;
}

type AllSourceItems = ListSourceItem | GeneratorSourceItem;
export default AllSourceItems;
