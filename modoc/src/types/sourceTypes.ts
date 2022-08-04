import { AllRenderItems } from ".";
import { ParsedFunction } from "./types";

export type ListSourceItem = {
    supertype: "source";
    type: "list";
    /**
     * Dot path to an array value in the data (ie. i.am.a.path.to.an.array)
     * @type {string}
     */
    source: string;
    renderer: AllRenderItems;
    conditionalRender?: ParsedFunction;
};

export type GeneratorSourceItem = {
    supertype: "source";
    type: "generator";
    /**
     * A function that takes data and outputs an array of {[key: string]: ValueItem | {...}}
     * @type {string}
     */
    function: ParsedFunction;
    renderer: AllRenderItems;
    conditionalRender?: ParsedFunction;
};
