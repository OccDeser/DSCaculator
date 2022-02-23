import React, { Component } from "react";
import DSCPopover from "./DSCPopover";
import OrgTree from "react-org-tree";
import DSCData from "./data.json";

class DSCTree extends Component {
  constructor(props) {
    super(props);

    console.log("tree: " + this.props.product);
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

  getChildrenNodes(product, key) {
    const pFormula = this.state.preferFormula[product];

    var children = pFormula.reactants.map((r, i) => {
      var k = key + "-" + pFormula.id + "-" + r.name + "-" + i;
      if (
        r.name != product &&
        this.state.preferFormula.hasOwnProperty(r.name)
      ) {
        return {
          id: "id-" + k,
          label: (
            <DSCPopover
              name={r.name}
              key={"key-" + k}
              formulas={DSCData.formula[r.name]}
              changeFormula={this.changePerferFormula}
            />
          ),
          children: this.getChildrenNodes(r.name, k),
        };
      } else {
        return {
          id: "id-" + k,
          label: (
            <DSCPopover
              name={r.name}
              key={"key-" + k}
              formulas={DSCData.formula[r.name]}
              changeFormula={this.changePerferFormula}
            />
          ),
        };
      }
    });

    return children;
  }

  genTreeNodes(product) {
    const k = "0";
    return {
      id: "id-" + k,
      label: (
        <DSCPopover
          name={product}
          key={"key-" + k}
          formulas={DSCData.formula[product]}
          changeFormula={this.changePerferFormula}
        />
      ),
      children: this.getChildrenNodes(product, k),
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
