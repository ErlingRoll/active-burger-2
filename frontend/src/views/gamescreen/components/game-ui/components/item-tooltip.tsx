import { PlacesType, Tooltip } from "react-tooltip"
import { Equipment, Item } from "../../../../../models/item"
import ItemInfo from "./item-info"

const ItemTooltip = ({ item, namespace, place }: { item: Partial<Item>; namespace: string; place?: PlacesType }) => {
    return (
        <div className="absolute z-210">
            <Tooltip className="pointer-events-none" anchorSelect={`#${namespace}-item-${item.id}`} place={place}>
                <ItemInfo itemId={item.id} item={item} />
            </Tooltip>
        </div>
    )
}

export default ItemTooltip
