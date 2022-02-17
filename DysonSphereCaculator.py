import os
import json
from math import gcd
from fractions import Fraction
import re

all_products = {}
all_machines = {}


class DSProduct(object):
    name = ''
    demands = {}
    timeconsume = 0
    outputnum = 0

    def __init__(self, name, config) -> None:
        self.name = name
        self.loadConfig(config)

    def __repr__(self) -> str:
        return self.name

    def loadConfig(self, config):
        f = open(config, 'r', encoding='utf8')
        data = json.load(f)
        self.demands = data[0]
        self.timeconsume = data[1]
        self.outputnum = data[2]
        f.close()

    def need(self, number, time):
        if self.demands['machine'] == '矿机':
            return 1, '矿机', []
        machine = all_machines[self.demands['machine']]
        mnumber = number * self.timeconsume / \
            (time * machine.efficient * self.outputnum)
        products = []
        for p in self.demands['products']:
            product = all_products[p]
            number = self.demands['products'][p]
            number = number / self.outputnum
            products.append({
                'product': product,
                'number': number
            })
        return mnumber, machine, products


class DSMachine(DSProduct):
    name = ''
    demands = {}
    efficient = 1
    timeconsume = 0
    outputnum = 0

    def loadConfig(self, config):
        f = open(config, 'r', encoding='utf8')
        data = json.load(f)
        self.demands = data[0]
        self.timeconsume = data[1]
        self.outputnum = data[2]
        self.efficient = data[3]
        f.close()


class DSTreeNode(object):
    def __init__(self, product, pnumber=1, ptime=0) -> None:
        self.name = product.name
        self.children = []
        self.machine = []
        self.pnumber = pnumber
        if ptime == 0:
            machine = all_machines[product.demands['machine']]
            ptime = product.timeconsume / machine.efficient
        self.getDemands(product, pnumber, ptime)

    def __repr__(self) -> str:
        return self.name

    def getDemands(self, product, pnumber, ptime):
        mnumber, machine, children = product.need(pnumber, ptime)
        self.machine = machine
        self.mnumber = float(mnumber)
        for child in children:
            childnum = child['number'] * pnumber
            childnode = DSTreeNode(child['product'], childnum, ptime)
            self.children.append(childnode)

    def formatTree(self, prelist=[], depth=0):
        res = ''
        if depth == 0:
            res += '%s: %d\n' % (self.name, self.pnumber)
        if len(self.children) != 0:
            for p in prelist:
                if p:
                    res += '│   '
                else:
                    res += '    '
            res += "├── %s: %.0f\n" % (self.machine, self.mnumber)

        for childnode in self.children:
            for p in prelist:
                if p:
                    res += '│   '
                else:
                    res += '    '
            if childnode != self.children[-1]:
                res += '├── %s: %.0f\n' % (childnode.name, childnode.pnumber)
                prelist.append(1)
            else:
                res += '└── %s: %.0f\n' % (childnode.name, childnode.pnumber)
                prelist.append(0)
            res += childnode.formatTree(prelist, depth+1)
            prelist = prelist[:depth]
        return res

    def printTree(self, prelist=[], depth=0):
        print(self.formatTree(), end='')


class DSCaculator(object):
    def __init__(self, configdir) -> None:
        self.denominators = []
        self.statistics = {}
        f = open(os.path.join(configdir, 'config.json'), 'r', encoding='utf8')
        data = json.load(f)
        f.close()

        pdir = os.path.join(configdir, 'products')
        products = data['products']
        for p in products:
            all_products[p] = DSProduct(p, os.path.join(pdir, p+'.json'))

        mdir = os.path.join(configdir, 'machines')
        machines = data['machines']
        for m in machines:
            all_machines[m] = DSMachine(m, os.path.join(mdir, m+'.json'))

    def clear(self):
        self.denominators.clear()
        self.statistics.clear()

    def getProductDenominators(self, dstree):
        if dstree.machine == "矿机":
            return
        f = Fraction(dstree.machine.efficient)
        self.denominators.append(f.limit_denominator().denominator)
        for child in dstree.children:
            f = Fraction(child.pnumber)
            self.denominators.append(f.limit_denominator().denominator)
            self.getProductDenominators(child)

    def countMachines(self, dstree):
        if dstree.machine == "矿机":
            return
        produce_type = (dstree.machine.name, dstree.name)
        if produce_type in self.statistics:
            self.statistics[produce_type] += dstree.mnumber
        else:
            self.statistics[produce_type] = dstree.mnumber
        for c in dstree.children:
            self.countMachines(c)

    def getDenominatorsLCM(self, dstree):
        self.getProductDenominators(dstree)
        self.countMachines(dstree)
        for s in self.statistics:
            f = Fraction(self.statistics[s])
            self.denominators.append(f.limit_denominator().denominator)
        lcm = 1
        for d in self.denominators:
            lcm = int(lcm*d/gcd(lcm, d))
        return lcm

    def formatStatis(self):
        res = ''
        for s in sorted(self.statistics.items(), key=lambda x: x[0], reverse=False):
            res += "%s %s %d\n" % (s[0][0], s[0][1], s[1])
        return res

    def printStatis(self):
        for s in sorted(self.statistics.items(), key=lambda x: x[0], reverse=False):
            print("%s %s %d" % (s[0][0], s[0][1], s[1]))

    def caculate(self, product):
        self.clear()

        if product in all_products:
            product = all_products[product]
        else:
            product = all_machines[product]

        resultree = DSTreeNode(product)
        pnumber = self.getDenominatorsLCM(resultree)
        resultree = DSTreeNode(product, pnumber)

        return resultree
