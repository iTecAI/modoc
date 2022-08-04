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

export default class RenderParser {
    private children: RenderParser[];
    public sourceParsers: {
        [key: string]: (item: AllSourceItems) => RenderParser[];
    } = {
        list: this.parseListSourceItem
    };

    constructor(
        public data: RawData,
        private renderer: AllRenderItems | AllSourceItems
    ) {
        this.children = [];

        if (isRenderItem(this.renderer)) {
            this.children = this.expandRenderItems(this.renderer);
        } else {
            this.children = this.parseSourceItem(this.renderer);
        }

        console.log(this.children);
    }

    public parseListSourceItem(item: ListSourceItem): RenderParser[] {
        const data = parseNested(this.data, item.source);
        if (isArray(data)) {
            return data.map((d) => new RenderParser(d, item.renderer));
        } else {
            throw `${JSON.stringify(data)} is not an any[] instance.`;
        }
    }

    public parseGeneratorSourceItem(item: GeneratorSourceItem): RenderParser[] {
        const rawResults: RawData[] = this.execParsedFunction(item.function);
        return rawResults.map(
            (result) => new RenderParser(result, item.renderer)
        );
    }

    public execParsedFunction(func: ParsedFunction): any {
        const executor = parseFunction(func.function);
        const parsedOptions: { [key: string]: any } = {};
        for (let k of Object.keys(func.opts)) {
            parsedOptions[k] = this.parseValueItem(func.opts[k]);
        }
        return executor(parsedOptions);
    }

    public parseValueItem(item: ValueItem): any {
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

    private parseSourceItem(item: AllSourceItems): RenderParser[] {
        if (item.type in this.sourceParsers) {
            return this.sourceParsers[item.type](item);
        }
        throw `Unknown SourceItem type ${item.type}`;
    }

    private expandRenderItems(item: AllRenderItems): RenderParser[] {
        if (item.children) {
            if (isSourceItem(item.children)) {
                return this.parseSourceItem(item.children); // TODO
            } else {
                return item.children.map((v) => new RenderParser(this.data, v));
            }
        } else if (item.child) {
            return [new RenderParser(this.data, item.child)];
        } else {
            return [];
        }
    }
}
