class CardPile:
    def __init__(self):
        self.__items = []
    def add_top(self, item):
        self.__items.insert(0, item)
    def add_bottom(self, item):
        self.__items.insert(len(self.__items), item)
    def remove_top(self):
        if self.size() != 0:
            number = self.__items[0]
            self.__items.pop(0)
            return number
    def remove_bottom(self):
        if self.size() != 0:
            number = self.__items[-1]
            self.__items.pop(-1)
            return number
    def size(self):
        return len(self.__items)
    def peek_top(self):
        return self.__items[0]
    def peek_bottom(self):
        return self.__items[-1]
    def print_all(self, index):
        if index == 0 and self.size() != 0:
                star = "* "
                print("{}: {}".format(index, self.__items[0]), star * (self.size() - 1))
        else:
            print("{}:".format(index), *self.__items, sep = ' ')
                    
class Solitaire:
    def __init__(self, cards):
        self.__piles = []# list of card piles
        self.__num_cards = len(cards)# number of cards
        self.__num_piles = (self.__num_cards // 8) + 3# number of piles
        self.__max_num_moves = self.__num_cards * 2# maximum number of moves
        for i in range(self.__num_piles):
            self.__piles.append(CardPile())
        for i in range(self.__num_cards):
            self.__piles[0].add_bottom(cards[i])
    def get_pile(self, i):
        return self.__piles[i]
    def display(self):
        for i in range(self.__num_piles):
            self.__piles[i].print_all(i)
    def move(self, p1, p2):
        if p1 == p2 and p2 == 0:
            if self.__piles[p1].size() != 0:
                values = self.__piles[p1].peek_top()
                self.__piles[0].remove_top()
                self.__piles[p2].add_bottom(values)
        elif p1 == 0 and p2 > 0:
            if self.__piles[p1].size() != 0:
                value = self.__piles[0].peek_top()
                if self.__piles[p2].size() == 0:
                    self.__piles[p1].remove_top()
                    self.__piles[p2].add_bottom(value)
                elif self.__piles[p2].peek_bottom() == value + 1:
                    self.__piles[p1].remove_top()
                    self.__piles[p2].add_bottom(value)
        elif p1 > 0 and p2 > 0:
            if self.__piles[p1].size() != 0 and self.__piles[p2].size() != 0:
                if self.__piles[p2].peek_bottom() == self.__piles[p1].peek_top() + 1:
                    while self.__piles[p1].size() != 0:
                        values = self.__piles[p1].peek_top()
                        self.__piles[p1].remove_top()
                        self.__piles[p2].add_bottom(values)
    def is_complete(self):
        count = 0
        for i in range(self.__num_piles):
            if self.__piles[i].size() != 0:
                count+=1
        if self.__piles[0].size() != 0:
            return False
        elif count > 1:
            return False
        else:
            return True

    def play(self):
        print("********************** NEW GAME *****************************")
        move_number = 1
        while move_number <= self.__max_num_moves and not self.is_complete():
            self.display()
            print("Round", move_number, "out of", self.__max_num_moves, end = ": ")
            row1 = int(input("Move from row no.:"),10)
            print("Round", move_number, "out of", self.__max_num_moves, end = ": ")
            row2 = int(input("Move to row no.:"),10)
            if row1 >= 0 and row2 >= 0 and row1 < self.__num_piles and row2 < self.__num_piles:
                self.move(row1, row2)
            move_number += 1
           
        if self.is_complete():
            print("You Win in", move_number - 1, "steps!\n")
        else:
            print("You Lose!\n")
cards = [2, 3, 1]
game = Solitaire(cards)
print(game.get_pile(0).peek_top())
	
	
cards = [3, 2, 1]
game = Solitaire(cards)
game.play()
