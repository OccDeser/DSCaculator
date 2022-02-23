import { Popover, Card } from "antd";
import DSCSelect from "./DSCSelect";

function DSCPopover(props) {
  const { name, formulas, changeFormula } = props;
  const onChange = (value) => {
    console.log("formula select: formula ", value);
    changeFormula(name, formulas[value]);
  };
  var content;
  if (formulas !== undefined) {
    var opts = formulas.map((f, i) => {
      var reactants = f.reactants.map((r) => r.name);
      return {
        label: reactants.join(" + "),
        value: i,
      };
    });
    content = (
      <Card title={name} bordered={false} style={{ width: 200 }}>
        公式
        <div style={{ paddingTop: 8, paddingBottom: 10 }}>
          <DSCSelect onChange={onChange} options={opts} />
        </div>
        <p>副产物</p>
      </Card>
    );
  } else {
    content = (
      <Card title={name} bordered={false} style={{ width: 200 }}>
        <p>开采设备</p>
      </Card>
    );
  }

  return (
    <Popover content={content} trigger="click">
      <div>{name}</div>
    </Popover>
  );
}

export default DSCPopover;
