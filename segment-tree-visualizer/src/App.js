import React from "react";
import CodeBlock from "./CodeBlock";
import SegmentTreeVisualizer from "./SegmentTreeVisualizer"

const cppCode = `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "Sum: " << (a + b) << endl;
    return 0;
}
`;

function App() {
  return (
    <div className="App" style={{ padding: "20px" }}>
      <h2>Beautiful C++ Code with Syntax Highlighting</h2>
      {/* <CodeBlock code={cppCode} language="cpp" /> */}
      <SegmentTreeVisualizer/>
    </div>
  );
}

export default App;
