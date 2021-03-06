import React, { useRef, useState, useEffect } from "react";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import VisTreeReact from "@vis-tree/react";
import useEventListener from "./use-listener";

function Box(props) {
  return (
    <div style={{ width: '100%', fontSize: 8, height: 20 }}>
      {props.children}
    </div>
  )
}

const originDataSource = {
  key: "O",
  component: (
    <Box>
      Org chart
    </Box>
  ),
  children: [
    {
      key: "E",
      children: [
        {
          key: "A",
        },
        {
          key: "D",
          children: [
            {
              key: "B",
            },
            {
              key: "C",
            },
          ],
        },
      ],
    },
    {
      key: "F",
    },
    {
      key: "N",
      children: [
        {
          key: "G",
        },
        {
          key: "M",
          children: [
            {
              key: "H",
            },
            {
              key: "I",
            },
            {
              key: "J",
            },
            {
              key: "K",
            },
            {
              key: "L",
            },
          ],
        },
      ],
    },
  ],
};


let count = 1;
let scale = 1;

const Demo = () => {
  const treeRef = useRef();
  const parentRef = useRef();
  const shouldExpandNodeKeyRef = useRef();

  const [dataSource, setDataSource] = useState(originDataSource);

  const [scaleRatio, setScaleRatio] = useState(1);
  const handleScaleRatioChange = (e) => {
    setScaleRatio(e.target.value);
  };

  const renderNode = ({ node, expanded, parentNode }) => {
    const thing = node.component || node.key
    return (
      <div
        style={{
          height: "100%",
          boxSizing: "border-box",
          background: "#fff",
          border: "1px solid black",
        }}
      >
        <div style={{ textAlign: "center" }}>{thing}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {parentNode && (
            <DeleteOutlined
              style={{ color: "#ff4d4f" }}
              onClick={() => {
                parentNode.children = parentNode.children.filter(
                  (item) => item.key !== node.key
                );
                setDataSource({ ...dataSource });
              }}
            />
          )}
          <AppstoreAddOutlined
            style={{ color: "#1890ff" }}
            onClick={() => {
              if (node.children) {
                node.children.push({ key: count });
              } else {
                node.children = [{ key: count }];
              }
              count += 1;
              if (!expanded) {
                shouldExpandNodeKeyRef.current = node.key;
              }
              setDataSource({ ...dataSource });
            }}
          />
        </div>
        {node.children && node.children.length > 0 && (
          <div
            style={{
              width: 15,
              height: 15,
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              background: "#fff",
              color: `${expanded ? "green" : "red"}`,
            }}
            onClick={() => {
              treeRef.current.toggleNodeExpanded(node.key);
            }}
          >
            {expanded ? (
              <MinusCircleOutlined style={{ display: "block" }} />
            ) : (
              <PlusCircleOutlined style={{ display: "block" }} />
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (shouldExpandNodeKeyRef.current) {
      treeRef.current.toggleNodeExpanded(shouldExpandNodeKeyRef.current);
      shouldExpandNodeKeyRef.current = undefined;
    }
  }, [dataSource]);

  // Command + mouse wheel zooming
  useEventListener('wheel', (event) => {
    // If command key held activate zooming
    if (event.metaKey) {
      event.preventDefault();
      scale += event.deltaY * -0.01;
      // Restrict scale
      scale = Math.min(Math.max(.125, scale), 2);
      setScaleRatio(scale);
    }
  }, parentRef.current, { capture: true });

  return (
    <div
      style={{
        position: "relative",
      }}
      
      ref={parentRef}
    >
      <input
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1,
        }}
        type="range"
        min={0.1}
        max={2}
        step={0.01}
        value={scaleRatio}
        onChange={handleScaleRatioChange}
      />
      <VisTreeReact
        style={{ width: "100%", height: "100vh" }}
        ref={treeRef}
        dataSource={dataSource}
        scaleRatio={scaleRatio}
        renderNode={renderNode}
        options={{
          defaultScrollInfo: {
            key: dataSource.key,
            top: 20,
          },
          defaultExpandAll: true,
          nodeWidth: 100,
          nodeHeight: 60,
        }}
      />
    </div>
  );
};

export default Demo;