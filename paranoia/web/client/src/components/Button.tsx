import React from "react";

export default function Button<T>(props: Record<string, any>) {
  return <button {...props} className="pure-button" style={{ backgroundColor: "#c9a0dcff" }}></button>;
}
