from kesi import Ku
import sys
import argparse
from typing import Literal


def parse_arguments():
    parser = argparse.ArgumentParser(description='')
    parser.add_argument("to", choices=['poj', 'kip', "tl"])
    return parser.parse_args()


def convert(to: Literal["poj" , "kip" , "tl"]):
    if to == "poj":
        for line in sys.stdin:
            print((Ku(line.rstrip()).POJ().lomaji))
    else:
        for line in sys.stdin:
            print((Ku(line.rstrip()).KIP().lomaji))


if __name__ == '__main__':
    arguments = parse_arguments()
    arguments.to
    convert(arguments.to)
