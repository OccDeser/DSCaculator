import json
import requests
from bs4 import BeautifulSoup

DATAFILE = 'data.json'

kuangwu_url = 'https://wiki.biligame.com/dsp/%E7%9F%BF%E7%89%A9'
zhenqi_url = 'https://wiki.biligame.com/dsp/%E7%8F%8D%E5%A5%87'
gongshi_url = 'https://wiki.biligame.com/dsp/%E5%85%AC%E5%BC%8F%E5%90%88%E9%9B%86'
jianzhu_url = 'https://wiki.biligame.com/dsp/%E9%A6%96%E9%A1%B5'


def savedata(kuangwu, jianzhu, gongshi):
    data = {
        'mineral': kuangwu,
        'building': jianzhu,
        'formula': gongshi
    }
    with open(DATAFILE, 'w', encoding='utf8') as f:
        json.dump(data, f, ensure_ascii=False)


def get_kuangwu():
    kuangwu = []
    r = requests.get(kuangwu_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    t = soup.find_all('tbody')
    trs = t[0].find_all('tr')[1:]
    for tr in trs:
        td = tr.find_all('td')[1]
        name = td.span.a.attrs['title']
        if name not in kuangwu:
            kuangwu.append(name)
    trs = t[1].find_all('tr')[1:]
    for tr in trs:
        td = tr.find_all('td')[0]
        name = td.text
        if name not in kuangwu:
            kuangwu.append(name)

    r = requests.get(zhenqi_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    tbody = soup.find('tbody')
    trs = tbody.find_all('tr')[1:]
    for tr in trs:
        td = tr.find_all('td')[0]
        name = td.text
        if name not in kuangwu:
            kuangwu.append(name.strip())

    return kuangwu


def get_gongshi():
    formulas = []
    r = requests.get(gongshi_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    tbody = soup.find('tbody')
    trs = tbody.find_all('tr')[1:]
    for tr in trs:
        formula = {}
        reactants = []
        products = []

        tds = tr.find_all('td')
        machine = tds[1].text.strip()
        formula['machine'] = machine
        if machine == '电网':
            continue

        formula_tag = tds[0].find(name="span", attrs={"class": "formula"})
        is_product = False
        for s in formula_tag.find_all('span'):
            if s.attrs['class'] == ['icon-background', 'icon-normal']:
                name = s.a.attrs['title'].strip()
                try:
                    num = int(s.span.text.strip())
                except:
                    num = 1
                if is_product:
                    products.append({"name": name, "num": num})
                else:
                    reactants.append({"name": name, "num": num})
            elif s.attrs['class'][0] == 'formula-arrow':
                is_product = True
                time = s.find(name="span", attrs={
                    "class": "formula-arrow-t-time"})
                try:
                    formula['time'] = float(time.text.strip('s'))
                except:
                    formula['time'] = time.text.strip('s')

        formula['products'] = products
        formula['reactants'] = reactants
        formulas.append(formula)

    return formulas


def get_jianzhu():
    r = requests.get(jianzhu_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    tbody = soup.find_all('tbody')[1]
    spans = tbody.find_all(name="span", attrs={
        "class": "icon-background icon-normal"})
    buildings = [s.a.attrs['title'].strip() for s in spans]
    return buildings


if __name__ == "__main__":
    kuangwu = get_kuangwu()
    gongshi = get_gongshi()
    jianzhu = get_jianzhu()
    savedata(kuangwu, jianzhu, gongshi)
