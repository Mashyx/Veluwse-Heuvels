import { useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
function InteractiveMap() {
  const [scale, setScale] = useState(1);
  const hidePOI = scale > 1.3;
  return (
    <TransformWrapper
      minScale={1}
      maxScale={4}
      onTransformed={(ref) => {
        setScale(ref.state.scale);
      }}
    >
      {({ zoomIn, zoomOut }) => (
        <>
          <div className="zoom-buttons">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
          </div>
          <TransformComponent>
            <div style={{ position: "relative" }}>
              <img
                src="/plaat.png"
                alt=""
                style={{ width: "100%" }}
              />
              {/* POI 1 */}
              <button
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "40%",
                  opacity: hidePOI ? 0 : 1,
                  transition: "0.3s",
                  pointerEvents: hidePOI ? "none" : "auto",
                }}
              >
              </button>
              {/* POI 2 */}
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "60%",
                  opacity: hidePOI ? 0 : 1,
                  transition: "0.3s",
                  pointerEvents: hidePOI ? "none" : "auto",
                }}
              >
              </button>
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
export default InteractiveMap;