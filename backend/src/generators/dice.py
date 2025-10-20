from random import random, randint


def roll_chance(luck: int = 0):
    # Roll between 0.0 and 1.0
    roll = random()
    for _ in range(luck):
        roll = max(roll, random())

    return roll


def roll(max_value: int, min_value: int = 0, luck: int = 0) -> int:
    roll = randint(min_value, max_value)
    for _ in range(luck):
        roll = max(roll, randint(min_value, max_value))

    return roll
