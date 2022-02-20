import json

fout = open('./DysonSphereCacuConfig.py', 'w', encoding='utf8')

with open('./config/config.json', 'r', encoding='utf8') as f:
    config = json.load(f)

config_str = 'config = ' + json.dumps(config, ensure_ascii=False) + '\n'
fout.write(config_str)

products = {}
for p in config['products']:
    with open('./config/products/%s.json' % p) as f:
        product = json.load(f)
        products[p] = product
products_str = 'products = ' + json.dumps(products, ensure_ascii=False) + '\n'
fout.write(products_str)

machines = {}
for m in config['machines']:
    with open('./config/machines/%s.json' % m) as f:
        machine = json.load(f)
        machines[m] = machine
machines_str = 'machines = ' + json.dumps(machines, ensure_ascii=False) + '\n'
fout.write(machines_str)

fout.close()
