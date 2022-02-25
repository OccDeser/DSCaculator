import { Popover, Card, Typography } from "antd";
import DSCSelect from "./DSCSelect";
const { Text } = Typography;

function MineralCard(props) {
  const { name } = props;

  return (
    <Card size="small" title={name} bordered={false} style={{ width: 200 }}>
      <p>自然开采</p>
    </Card>
  );
}

function ProductCard(props) {
  const { name, formulas, onChange, pformula } = props;
  const paddning = 8;
  console.log(pformula);
  var defaultValue = formulas.indexOf(pformula);
  var opts = formulas.map((f, i) => {
    var reactants = f.reactants.map((r) => r.name);
    return {
      label: reactants.join(" + "),
      value: i,
    };
  });

  var formulaCom = (
    <div style={{ paddingBottom: paddning }}>
      <Text>选择公式: </Text>
      <div style={{ paddingTop: 5 }}>
        <DSCSelect
          options={opts}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );

  var byproductsCom = <></>;
  if (pformula.by_products.length > 0) {
    console.log(pformula.by_products);
    byproductsCom = (
      <div style={{ paddingBottom: paddning }}>
        <Text>副产物: </Text>
        <Text>{pformula.by_products.map((item) => item.name).join(" + ")}</Text>
      </div>
    );
  }

  var machineCom = (
    <div style={{ paddingBottom: paddning }}>
      <Text>制造设备: {pformula.machine}</Text>
    </div>
  );
  return (
    <div>
      <Card size="small" title={name} bordered={false} style={{ width: 200 }}>
        {byproductsCom}
        {machineCom}
        {formulaCom}
      </Card>
    </div>
  );
}

function DSCPopover(props) {
  const { name, formulas, changeFormula, perferFormula } = props;

  const onChange = (value) => {
    console.log("formula select: formula ", value);
    changeFormula(name, formulas[value]);
  };

  var content;
  if (formulas !== undefined) {
    content = (
      <ProductCard
        name={name}
        formulas={formulas}
        onChange={onChange}
        pformula={perferFormula}
      />
    );
  } else {
    content = <MineralCard name={name} />;
  }

  return (
    <Popover content={content} trigger="click">
      <div>{name}</div>
    </Popover>
  );
}

export default DSCPopover;
