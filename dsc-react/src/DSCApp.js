import React from "react";
import DSCSelect from "./DSCSelect";
import DSCTree from "./DSCTree";
import DSCData from "./data.json";
import { Row, Col, Button } from "antd";

class DSCApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: undefined,
      furnace: DSCData.furnace[0],
      manufacture: DSCData.manufacture[0],
      collapsable: true,
    };
  }
  changeOnProduct = (product) => {
    console.log("changeOnProduct " + product);
    this.setState({
      product: product,
    });
  };
  changeOnFurnace = (furnace) => {
    console.log("changeOnFurnace " + furnace);
    this.setState({
      furnace: furnace,
    });
  };
  changeOnManufacture = (manufacture) => {
    console.log("changeOnManufacture " + manufacture);
    this.setState({
      manufacture: manufacture,
    });
  };
  opt = (list) => {
    return list.map((p) => {
      return {
        label: p,
        value: p,
      };
    });
  };
  render() {
    var tree = <> </>;
    if (this.state.product !== undefined) {
      console.log(this.state.product);
      tree = (
        <DSCTree
          product={this.state.product}
          furnace={this.state.furnace}
          manufacture={this.state.manufacture}
          collapsable={this.state.collapsable}
        />
      );
    }

    return (
      <div>
        <Row justify="center" style={{ padding: 10 }}>
          <Col flex="0 1 50%">
            <Row justify="space-around" gutter={[0, 12]}>
              <Col flex="1 1 150px">
                <Row justify="center">
                  <DSCSelect
                    onChange={this.changeOnProduct}
                    options={this.opt(DSCData.product)}
                    defaultValue={[]}
                  />
                </Row>
              </Col>
              <Col flex="1 1 150px">
                <Row justify="center">
                  <DSCSelect
                    onChange={this.changeOnFurnace}
                    options={this.opt(DSCData.furnace)}
                    defaultValue={this.state.furnace}
                  />
                </Row>
              </Col>
              <Col flex="1 1 150px">
                <Row justify="center">
                  <DSCSelect
                    onChange={this.changeOnManufacture}
                    options={this.opt(DSCData.manufacture)}
                    defaultValue={this.state.manufacture}
                  />
                </Row>
              </Col>
              <Col flex="1 1 100px">
                <Row justify="center">
                  <Button
                    onClick={() => {
                      this.setState({
                        collapsable: !this.state.collapsable,
                      });
                    }}
                  >
                    {this.state.collapsable ? "展开" : "折叠"}
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        {tree}
      </div>
    );
  }
}

export default DSCApp;
