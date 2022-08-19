import RenderParser from "../renderParser";
import React from "react";
import {
    RenderChipItem,
    RenderDividerItem,
    RenderGroupItem,
    RenderTextItem
} from "../types/renderTypes";
import { Avatar, Chip, Divider, Typography } from "@mui/material";
import { RawData, AllRenderItems, AllSourceItems } from "../types";
import * as ReactIconsMd from "react-icons/md";
import * as ReactIconsGi from "react-icons/gi";
import { IconType } from "react-icons";

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

    private iconMap = {
        md: ReactIconsMd,
        gi: ReactIconsGi
    };

    constructSelf(
        data: RawData,
        renderer: AllRenderItems | AllSourceItems
    ): MuiRenderParser {
        return new MuiRenderParser(data, renderer);
    }

    Icon(props: { name: string; [key: string]: any }) {
        const [family, id] = props.name.split(".");
        try {
            const IconElement: IconType = (
                this.iconMap[family as "md" | "gi"] as any
            )[id];
            return <IconElement className="mui-icon" {...props} />;
        } catch (e) {
            throw `Failed to load icon ${props.name}`;
        }
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

    renderChip(_: JSX.Element[], object: RenderChipItem): JSX.Element {
        let avatar: JSX.Element | undefined = undefined;
        if (object.avatar) {
            switch (object.avatar.type) {
                case "icon":
                    avatar = (
                        <Avatar>
                            <this.Icon name={object.avatar.name} />
                        </Avatar>
                    );
            }
        }
        return (
            <Chip
                variant={object.filled ? "filled" : "outlined"}
                label={this.parseValueItem(object.text)}
                avatar={avatar}
            />
        );
    }
}
