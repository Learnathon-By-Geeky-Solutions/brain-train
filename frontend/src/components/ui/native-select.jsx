function _optionalChain(ops) {
  let lastAccessLHS;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return undefined;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}
("use client");

import { NativeSelect as Select } from "@chakra-ui/react";
import * as React from "react";

import PropTypes from "prop-types";

export const NativeSelectRoot = React.forwardRef(
  function NativeSelect(props, ref) {
    const { icon, children, ...rest } = props;
    return (
      <Select.Root ref={ref} {...rest}>
        {children}
        <Select.Indicator>{icon}</Select.Indicator>
      </Select.Root>
    );
  },
);

NativeSelectRoot.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
};

export const NativeSelectField = React.forwardRef(
  function NativeSelectField(props, ref) {
    const { items: itemsProp, children, ...rest } = props;
    const items = React.useMemo(
      () =>
        _optionalChain([
          itemsProp,
          "optionalAccess",
          (_) => _.map,
          "call",
          (_2) =>
            _2((item) =>
              typeof item === "string" ? { label: item, value: item } : item,
            ),
        ]),
      [itemsProp],
    );

    return (
      <Select.Field ref={ref} {...rest}>
        {children}
        {_optionalChain([
          items,
          "optionalAccess",
          (_3) => _3.map,
          "call",
          (_4) =>
            _4((item) => (
              <option
                key={item.value}
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </option>
            )),
        ])}
      </Select.Field>
    );
  },
);

NativeSelectField.propTypes = {
  items: PropTypes.array,
  children: PropTypes.node,
};
