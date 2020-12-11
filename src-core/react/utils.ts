import isPropValid from "@emotion/is-prop-valid";

const invalidProps: { [k: string]: boolean } = {
  onValueChange: true,
  open: true,
  onSearch: true,
  onOpen: true,
  onPressEnter: true,
};

const isInvalidProp = (k: string) => {
  return invalidProps[k];
};

export const pickDOMAttrs = (props: { [key: string]: any }) => {
  const p: { [key: string]: any } = {};

  for (const k in props) {
    if (isPropValid(k) && !isInvalidProp(k)) {
      p[k] = props[k];
    }
  }

  return p;
};
