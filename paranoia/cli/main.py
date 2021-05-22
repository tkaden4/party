from os import system, name
import random
people = ["kaden", "augustus", "jeremy", "justin", "lilu", "connor", "diana"]


def clear():
    if name == 'nt':
        _ = system('cls')
    else:
        _ = system('clear')


while True:
    [asker, askee] = random.sample(people, 2)

    print(asker, "asks", askee)
    input("check for revealed?")
    print(("give us the question " + asker) if random.random() <= 6 /
          10 else "your secrets are forever hidden.....")
    input("Next round?")
    clear()
