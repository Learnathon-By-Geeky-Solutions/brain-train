import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import * as React from "react";
import PropTypes from "prop-types";

export const Checkbox = React.forwardRef(function Checkbox(props, ref) {
  const { icon, children, inputProps, rootRef, ...rest } = props;
  return (
    <ChakraCheckbox.Root ref={rootRef} {...rest}>
      <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
      <ChakraCheckbox.Control>
        {icon || <ChakraCheckbox.Indicator />}
      </ChakraCheckbox.Control>
      {children != null && (
        <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
      )}
    </ChakraCheckbox.Root>
  );
});

Checkbox.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
  inputProps: PropTypes.object,
  rootRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};
