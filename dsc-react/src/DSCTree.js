import React, { Component } from "react";
import DSCPopover from "./DSCPopover";
import OrgTree from "react-org-tree";
import DSCData from "./data.json";

class DSCTree extends Component {
  constructor(props) {
    super(props);

    var preferFormula = {};
    for (var p in DSCData.formula) {
      preferFormula[p] = DSCData.formula[p][0];
    }

    this.state = {
      horizontal: true,
      expandAll: false,
      labelClassName: "bg-white",
      preferFormula: preferFormula,
    };
  }

  changePerferFormula = (product, formula) => {
    var pFormula = this.state.preferFormula;
    pFormula[product] = formula;
    this.setState({
      preferFormula: pFormula,
    });
  };

  getEfficient = (machine) => {
    var furnaceE, manufactureE;
    if (this.props.furnace === "位面熔炉") {
      furnaceE = 2;
    } else if (this.props.furnace === "电弧熔炉") {
      furnaceE = 1;
    } else {
      console.log("furnace error");
    }
    if (this.props.manufacture === "制造台MK.I") {
      manufactureE = 0.75;
    } else if (this.props.manufacture === "制造台MK.II") {
      manufactureE = 1;
    } else if (this.props.manufacture === "制造台MK.III") {
      manufactureE = 1.5;
    } else {
      console.log("manufacture error");
    }

    var efficient;
    if (machine === "冶炼设备") {
      efficient = furnaceE;
    } else if (machine === "制造台") {
      efficient = manufactureE;
    } else {
      efficient = 1;
    }
    return efficient;
  };

  getChildrenNodes(product, key, demandNum) {
    const pFormula = this.state.preferFormula[product];

    var children = pFormula.reactants.map((r, i) => {
      var k = key + "-" + pFormula.id + "-" + r.name + "-" + i;
      var reactantNum = (demandNum / pFormula.num) * r.num;
      if (
        r.name !== product &&
        this.state.preferFormula.hasOwnProperty(r.name)
      ) {
        var pformula = this.state.preferFormula[r.name];
        var efficient = this.getEfficient(pformula.machine);
        return {
          id: "id-" + k,
          label: (
            <DSCPopover
              name={r.name}
              key={"key-" + k}
              demandNum={reactantNum}
              time={this.props.time}
              efficient={efficient}
              perferFormula={pformula}
              formulas={DSCData.formula[r.name]}
              changeFormula={this.changePerferFormula}
            />
          ),
          children: this.getChildrenNodes(r.name, k, demandNum),
        };
      } else {
        return {
          id: "id-" + k,
          label: (
            <DSCPopover
              name={r.name}
              key={"key-" + k}
              demandNum={reactantNum}
              time={this.props.time}
            />
          ),
        };
      }
    });

    return children;
  }

  genTreeNodes(product) {
    const k = "0";
    const pformula = this.state.preferFormula[product];
    var efficient = this.getEfficient(pformula.machine);
    var demandNum =
      (this.props.time / pformula.time) *
      pformula.num *
      this.props.times *
      efficient;

    console.log(
      "genTreeNodes ",
      efficient,
      pformula.machine,
      this.props.manufacture
    );
    return {
      id: "id-" + k,
      label: (
        <DSCPopover
          name={product}
          key={"key-" + k}
          demandNum={demandNum}
          time={this.props.time}
          efficient={efficient}
          formulas={DSCData.formula[product]}
          changeFormula={this.changePerferFormula}
          perferFormula={pformula}
        />
      ),
      children: this.getChildrenNodes(product, k, demandNum),
    };
  }

  render() {
    return (
      <div className="m-t-lg text-center">
        <OrgTree
          data={this.genTreeNodes(this.props.product)}
          horizontal={this.state.horizontal}
          collapsable={this.props.collapsable}
          labelClassName={this.state.labelClassName}
          expandAll={this.state.expandAll}
          renderContent={(data) => {
            return data.label;
          }}
        ></OrgTree>
      </div>
    );
  }
}

export default DSCTree;
