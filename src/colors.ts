const list = ["fa1e1e", "f1fa1e", "d838cb", "f5821f", "42c6f0", "4bd838", "fa1e1e"];

const colors = list
  .concat(
    list.map(color =>
      color
        .split("")
        .reverse()
        .join("")
    )
  )
  .map(color => "#" + color);

export default colors;
export { colors };
