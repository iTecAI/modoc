import { isArray, isLiteral, isRenderItem, isSourceItem } from "./types/guards";
import AllRenderItems from "./types/renderTypes";
import AllSourceItems, {
    ListSourceItem,
    GeneratorSourceItem
} from "./types/sourceTypes";
import {
    ParsedFunction,
    RawData,
    ValueItem,
    ValueStringDirective,
    ValueStringDirectiveNames
} from "./types/types";
import { parseFunction } from "./util";
import parseNested from "./util/nestedParser";
import React from "react";

export default class RenderParser {
    /**
     * Set this when extending, it should be the new class that extends RenderParser.
     */
    public SELF_CONSTRUCTOR = RenderParser;
    /**
     * Array of parsed children (all value items parsed, expanded to RenderParsers)
     */
    private children: RenderParser[];

    /**
     * Add additional sourceParsers here when extending
     */
    public sourceParsers: {
        [key: string]: (item: AllSourceItems) => RenderParser[];
    } = {
        list: this.parseListSourceItem,
        generator: this.parseGeneratorSourceItem
    };

    /**
     * Add additional render functions here when extending
     */
    public renderers: {
        [key: string]: (children: JSX.Element[]) => JSX.Element;
    } = {};

    /**
     * RenderParser is the React framework-agnostic base class.
     * It has no rendering capability by itself, but can be extended to add such capability.
     * @param data Raw data object, likely from server or something
     * @param renderer RenderItem specification or SourceItem
     */
    constructor(
        protected data: RawData,
        protected renderer: AllRenderItems | AllSourceItems
    ) {
        this.children = [];

        if (isRenderItem(this.renderer)) {
            this.children = this.expandRenderItems(this.renderer);
        } else {
            this.children = this.parseSourceItem(this.renderer);
        }
    }

    /**
     * Sets new data & re-parses all children
     * @param data New data
     */
    public setData(data: RawData) {
        this.data = data;

        if (isRenderItem(this.renderer)) {
            this.children = this.expandRenderItems(this.renderer);
        } else {
            this.children = this.parseSourceItem(this.renderer);
        }
    }

    /**
     * Sets new renderer and re-parses all children
     * @param renderer New RenderItem or SourceItem
     */
    public setRenderer(renderer: AllRenderItems | AllSourceItems) {
        this.renderer = renderer;

        if (isRenderItem(this.renderer)) {
            this.children = this.expandRenderItems(this.renderer);
        } else {
            this.children = this.parseSourceItem(this.renderer);
        }
    }

    /**
     * Parser for ListSourceItems
     * @param item ListSourceItem
     * @returns Array of RenderParser
     */
    protected parseListSourceItem(item: ListSourceItem): RenderParser[] {
        const data = parseNested(this.data, item.source);
        if (isArray(data)) {
            return data.map((d) => this.constructSelf(d, item.renderer));
        } else {
            throw `${JSON.stringify(data)} is not an any[] instance.`;
        }
    }

    /**
     * Parser for GeneratorSourceItems
     * @param item GeneratorSourceItem
     * @returns Array of RenderParser
     */
    protected parseGeneratorSourceItem(
        item: GeneratorSourceItem
    ): RenderParser[] {
        const rawResults: RawData[] = this.execParsedFunction(item.function);
        return rawResults.map((result) =>
            this.constructSelf(result, item.renderer)
        );
    }

    /**
     * Executes a ParsedFunction object, passing in required data and loading string code.
     * @param func ParsedFunction object
     * @returns Returned data
     */
    protected execParsedFunction(func: ParsedFunction): any {
        const executor = parseFunction(func.function);
        const parsedOptions: { [key: string]: any } = {};
        for (let k of Object.keys(func.opts)) {
            parsedOptions[k] = this.parseValueItem(func.opts[k]);
        }
        return executor(parsedOptions);
    }

    /**
     * Parse a ValueItem. Likely will be the most useful in render functions.
     * @param item ValueItem to parse. Can be a literal, a "$directive:data" string, or a Text/Functional/DataItem
     * @returns The value retrieved/created
     */
    protected parseValueItem(item: ValueItem): any {
        if (typeof item === "string") {
            if (item.startsWith("$")) {
                const directiveRaw: string = item.split(":")[0].split("$")[1];
                let directive: ValueStringDirective;
                if (ValueStringDirectiveNames.includes(directiveRaw)) {
                    directive = directiveRaw as ValueStringDirective;
                } else {
                    throw `Directive ${directiveRaw} not recognized.`;
                }
                const data = item.split(":")[1];

                switch (directive) {
                    case "data":
                        return parseNested(this.data, data);
                }
            }
        } else if (isLiteral(item)) {
            return item;
        } else {
            switch (item.type) {
                case "data":
                    return parseNested(this.data, item.source);
                case "text":
                    let subbedText: string = item.content + "";
                    for (let k of Object.keys(item.substitutions)) {
                        subbedText.replaceAll(
                            `{{${k}}}`,
                            this.parseValueItem(
                                item.substitutions[k]
                            ).toString()
                        );
                    }
                    return subbedText;
                case "function":
                    const executor = parseFunction(item.function);

                    const parsedOptions: { [key: string]: any } = {};
                    for (let k of Object.keys(item.opts)) {
                        parsedOptions[k] = this.parseValueItem(item.opts[k]);
                    }

                    return executor(parsedOptions);
            }
        }
    }

    /**
     * Parses a SourceItem
     * @param item SourceItem representation
     * @returns Array of RenderParsers
     */
    protected parseSourceItem(item: AllSourceItems): RenderParser[] {
        if (item.type in this.sourceParsers) {
            return this.sourceParsers[item.type].bind(this)(item);
        }
        throw `Unknown SourceItem type ${item.type}`;
    }

    /**
     * Expands RenderItem children into RenderParsers
     * @param item RenderItem
     * @returns Array of RenderParsers
     */
    protected expandRenderItems(item: AllRenderItems): RenderParser[] {
        if (item.children) {
            if (isSourceItem(item.children)) {
                return this.parseSourceItem(item.children); // TODO
            } else {
                return item.children.map((v) =>
                    this.constructSelf(this.data, v)
                );
            }
        } else if (item.child) {
            return [this.constructSelf(this.data, item.child)];
        } else {
            return [];
        }
    }

    /**
     * Constructs self (for internal functions that instantiate new RenderParsers)
     * @param data RawData
     * @param renderer RenderItem or SourceItem
     * @returns RenderParser instance
     */
    protected constructSelf(
        data: RawData,
        renderer: AllRenderItems | AllSourceItems
    ): RenderParser {
        return new this.SELF_CONSTRUCTOR(data, renderer);
    }

    /**
     * Renders using current data and renderer
     * @returns JSX Element
     */
    public render(): JSX.Element {
        if (this.renderer.conditionalRender) {
            if (!this.execParsedFunction(this.renderer.conditionalRender)) {
                return <></>;
            }
        }
        if (this.renderer.supertype === "render") {
            if (Object.keys(this.renderers).includes(this.renderer.type)) {
                return this.renderers[this.renderer.type](
                    this.children.map((r) => r.render())
                );
            } else {
                throw `Unknown renderer type ${this.renderer.type}`;
            }
        } else {
            return (
                <>
                    {this.renderers[this.renderer.type](
                        this.children.map((r) => r.render())
                    )}
                </>
            );
        }
    }
}
