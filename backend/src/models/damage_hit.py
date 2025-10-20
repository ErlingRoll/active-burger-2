
from pydantic import BaseModel


class DamageHit(BaseModel):
    physical: int = 0
    fire: int = 0
    cold: int = 0
    lightning: int = 0

    def total_damage(self) -> int:
        return self.physical + self.fire + self.cold + self.lightning

    def elemental(self) -> int:
        return self.fire + self.cold + self.lightning
