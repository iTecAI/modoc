import RenderParser from "../renderParser";
import React from "react";
import {
    RenderDividerItem,
    RenderGroupItem,
    RenderTextItem
} from "../types/renderTypes";
import { Divider, Typography } from "@mui/material";
import { RawData, AllRenderItems, AllSourceItems } from "../types";

export default class MuiRenderParser<
    T extends AllRenderItems = AllRenderItems
> extends RenderParser<T> {
    public renderers: {
        [key: string]: (children: JSX.Element[], object: any) => JSX.Element;
    } = {
        group: this.renderGroup,
        text: this.renderText,
        divider: this.renderDivider
    };

    constructSelf(
        data: RawData,
        renderer: AllRenderItems | AllSourceItems
    ): MuiRenderParser {
        return new MuiRenderParser(data, renderer);
    }

    renderGroup(children: JSX.Element[], _: RenderGroupItem): JSX.Element {
        return <div className="modoc_mui-group">{children}</div>;
    }

    renderText(_: JSX.Element[], object: RenderTextItem): JSX.Element {
        return (
            <Typography
                variant={object.textType}
                sx={{
                    fontWeight: object.style.includes("bold") ? 400 : undefined,
                    textDecorationLine: [
                        object.style.includes("underline") ? "underline" : "",
                        object.style.includes("strikethrough")
                            ? "line-through"
                            : ""
                    ]
                        .join(" ")
                        .trim(),
                    fontStyle: object.style.includes("italic")
                        ? "italic"
                        : undefined
                }}
            >
                <span>{this.parseValueItem(object.text)}</span>
            </Typography>
        );
    }

    renderDivider(
        children: JSX.Element[],
        object: RenderDividerItem
    ): JSX.Element {
        return (
            <Divider
                variant={
                    {
                        full: "fullWidth",
                        inset: "inset",
                        middle: "middle"
                    }[object.variant] as any
                }
            >
                {children}
            </Divider>
        );
    }
}
