import RenderParser from "../renderParser";
import React from "react";
import { AllRenderItems } from "../types";
import {
    RenderDividerItem,
    RenderGroupItem,
    RenderTextItem
} from "../types/renderTypes";
import { Divider, Typography } from "@mui/material";

export default class MuiRenderParser extends RenderParser {
    public SELF_CONSTRUCTOR: typeof RenderParser = MuiRenderParser;
    public renderers: {
        [key: string]: (children: JSX.Element[], object: any) => JSX.Element;
    } = {
        group: this.renderGroup,
        text: this.renderText,
        divider: this.renderDivider
    };

    public renderGroup(
        children: JSX.Element[],
        _: RenderGroupItem
    ): JSX.Element {
        return <div className="modoc_mui-group">{children}</div>;
    }

    public renderText(_: JSX.Element[], object: RenderTextItem): JSX.Element {
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
                {object.text}
            </Typography>
        );
    }

    public renderDivider(
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
