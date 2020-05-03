export const isTerminalScrolledDown = (
  scrollHeight,
  scrollTop,
  terminalHeight,
  tolerance
) => scrollTop <= scrollHeight - terminalHeight - tolerance;
