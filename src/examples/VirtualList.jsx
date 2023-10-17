import React from "react";
import ReactDOM from "react-dom";

import "./virtualList.css";

import { useVirtual } from "react-virtual";
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getSrc = () => `https://picsum.photos/200/${getRandomInt(3, 5)}00`;

export default function VirtualList() {
  console.log(`file: VirtualList.jsx:13 ~ VirtualList ~ VirtualList:`, VirtualList);
  const rows = new Array(500).fill(true).map((f, i) => ({
    // height: 25 + Math.round(Math.random() * 150),
    src: getSrc(),
    title: `Row ${i}`
  }));

  return (
    <div>
      <RowVirtualizerVariable rows={rows} />
    </div>
  );
}

function RowVirtualizerVariable({ rows }) {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtual({
    size: rows.length,
    parentRef,
    estimateSize: React.useCallback((i) => 400, []),
    overscan: 5
  });

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `700px`,
          width: `400px`,
          overflow: "auto",border:'2px solid black', marginTop: 150
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.index}
              ref={virtualRow.measureRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                // height: `${rows[virtualRow.index]}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
                Index = {virtualRow.index}
              {/* Row {virtualRow.index} */}
              {/* <img src={rows[virtualRow.index].src} /> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
