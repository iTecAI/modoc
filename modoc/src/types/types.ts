export type Literal = string | number | boolean;

export type TextItem = {
    supertype: "value";
    type: "text";
    /**
     * @type {string}
     * String containing possible substitutions.
     * Format: "I am a {{test}} string"
     */
    content: string;
    /**
     * @type {{[key: string]: string | ValueItem}}
     * A mapping of substitution names to values
     */
    substitutions: { [key: string]: Literal | ValueItem };
};

export type FunctionalItem = {
    supertype: "value";
    type: "function";
    /**
     * @type {string | string[]}
     * String code (or lines of string code) of the following form:
     *     (opts: {[key: string]: any}) => string | TextItem
     */
    function: string | string[];
    opts: { [key: string]: Literal | ValueItem };
};

export type DataItem = {
    supertype: "value";
    type: "data";
    /**
     * Dot path to raw value in data (ie. path.to.data)
     * @type {string}
     */
    source: string;
};

export type ValueItem = Literal | TextItem | FunctionalItem | DataItem;

export type ParsedFunction = {
    /**
     * @type {string | string[]}
     * String code (or lines of string code) of the following form:
     *     (opts: {[key: string]: any}) => any
     */
    function: string | string[];
    opts: { [key: string]: Literal | ValueItem };
};

export interface RenderItem {
    supertype: "render";
    type: string;
    conditionalRender?: ParsedFunction;
}

export interface SourceItem {
    supertype: "source";
    type: string;
    conditionalRender?: ParsedFunction;
}
