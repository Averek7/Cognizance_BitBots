import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ProductBoard from "./ProductBoard";
const QrReader = dynamic(() => import(`react-weblineindia-qrcode-scanner`), {
  ssr: false,
});

function Scan() {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [tokenID, setTokenID] = useState("");

  const handleLoad = () => {
    setIsReady(true);
  };

  const [data, setData] = useState({
    tokenID: "",
  });

  const handleDetected = (data) => {
    setScannedData(data);
    console.log(`Scanned Data: ${data}`);
    if (videoRef.current && isReady) {
      videoRef.current.play().catch((error) => {
        console.error("Error starting scanner:", error);
      });
    }
    {
      videoRef.current &&
        videoRef.current.video &&
        console.log(`Video width: ${videoRef.current.video.videoWidth}`);
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };

  const handleClick = (e) => {};

  const previewStyle = {
    height: 250,
    width: 300,
  };

  // const redirect = (data) => {
  //   router.push(!data ? "/" : data.substring(52, data.length - 1));
  // };

  return (
    <>
      <div className="QrMain">
        {scannedData ? (
          <div className="QrScanner">
            <QrReader
              style={previewStyle}
              onScan={handleDetected}
              onLoad={handleLoad}
              onError={(e) => {
                console.error(e.message);
              }}
            />
          </div>
        ) : (
          <>
            <ProductBoard scannedData={scannedData} />
          </>
        )}
        {scannedData ? (
          <div className="input-container" style={{ textAlign: "center" }}>
            <input
              type="Number"
              name="tokenID"
              title="Token ID"
              value={data.tokenID}
              handleChange={handleChange}
              placeholder="Enter Token ID"
            />

            <div className="" style={{ textAlign: "center" }}>
              <button className="" onClick={handleClick}>
                "Get Product"
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Scan;
