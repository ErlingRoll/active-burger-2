import datetime
from pyventus.reactive import as_observable_task, Completed


class Gamestate:

    start_datetime = None

    def __init__(self):
        self.start_datetime = datetime.datetime.now()

    @as_observable_task
    def publishGamestate(self):
        return self.getGamestate()
