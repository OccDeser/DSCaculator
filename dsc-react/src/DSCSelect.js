import React from "react";
import { Select } from "antd";
const { Option } = Select;

function DSCSelect(props) {
  const { onChange, options, defaultValue } = props;

  return (
    <Select
      showSearch
      style={{ width: 150 }}
      defaultValue={defaultValue}
      placeholder="Please select"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options.map((opt) => {
        return (
          <Option value={opt.value}  key={opt.value}>
            {opt.label}
          </Option>
        );
      })}
    </Select>
  );
}

export default DSCSelect;
