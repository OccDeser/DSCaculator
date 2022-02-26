import React from "react";
import DSCSelect from "./DSCSelect";
import DSCTree from "./DSCTree";
import DSCData from "./data.json";
import { Row, Col, Button, InputNumber } from "antd";

class DSCApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: undefined,
      furnace: DSCData.furnace[0],
      manufacture: DSCData.manufacture[0],
      time: 1800,
      times: 1,
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

  changeOnTimes = (times) => {
    console.log("changeOnTimes " + times);
    this.setState({
      times: times,
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
      tree = (
        <DSCTree
          time={this.state.time}
          times={this.state.times}
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
              <Col flex="1 1 80px">
                <Row justify="center">
                  <InputNumber
                    style={{ width: 80 }}
                    defaultValue={1}
                    min={1}
                    max={72900}
                    formatter={(value) => `x${value}`}
                    parser={(value) => value.replace("x", "")}
                    onChange={this.changeOnTimes}
                  />
                </Row>
              </Col>
              <Col flex="1 1 80px">
                <Row justify="center">
                  <Button
                    style={{ width: 80 }}
                    onClick={() => {
                      this.setState({
                        collapsable: !this.state.collapsable,
                      });
                    }}
                  >
                    取整
                  </Button>
                </Row>
              </Col>
              <Col flex="1 1 80px">
                <Row justify="center">
                  <Button
                    style={{ width: 80 }}
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
