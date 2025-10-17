
from enum import Enum


class ToolMod(Enum):
    EFFICIENCY = "efficiency"
    FORTUNE = "fortune"


mod_value = {
    ToolMod.EFFICIENCY.value: [200, 150, 100, 70, 40, 20, 12, 8, 5],
    ToolMod.FORTUNE.value: [10, 8, 7, 6, 5, 4, 3, 2, 1]
}
