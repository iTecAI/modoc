import AllSourceItems from "./sourceTypes";
import { RenderItem } from "./types";

export interface RenderGroupItem extends RenderItem {
    type: "group";
    children: AllRenderItems[] | AllSourceItems;
}

type AllRenderItems = RenderGroupItem;
export default AllRenderItems;
