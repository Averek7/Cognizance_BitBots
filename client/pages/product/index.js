import React, { useState } from "react";
import Error from "@/components/Error";
import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
import InputBox from "@/components/InputBox";
import { setError } from "@/redux/slices/error";
import { setSuccess } from "@/redux/slices/success";
import { addProduct } from "@/redux/slices/manufacturer";
import { useDispatch, useSelector } from "react-redux";
import { Web3Storage } from "web3.storage";

function Index() {
  const [localLoading, setLocalLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    image: "",
    expiry: "",
  });

  const dispatch = useDispatch();
  const { walletAddress, instances } = useSelector((state) => state.navbar);

  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhQTQzM0RkY2M4QzM5YWJFQzdmNzZDM2REQjlFOTBhMWY3RTk2RjMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjkxMjcxMDk3NjMsIm5hbWUiOiJsZW5kTmZ0In0.7Zu-wSF34-7GlU5rVIXAvrIczw6MQYT4yV7vOVU9pis`;
  const storage = new Web3Storage({ token: token });

  const nftUpload = (e) => {
    e.preventDefault();
    setLocalLoading(true);

    const nFile = e.target.files;
    console.log(nFile);
    storage
      .put(nFile)
      .then((res) => {
        console.log(res);
        setLocalLoading(false);
        setData({
          ...data,
          image: `https://ipfs.io/ipfs/${res}/${nFile[0].name}`,
        });
        dispatch(setSuccess("Uploaded"));
      })
      .catch((err) => {
        setLocalLoading(false);
        dispatch(setError(err.message));
      });
    console.log(data.image);
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };
  const handleClick = async () => {
    dispatch(
      addProduct({
        title: data.title,
        id: data.tokenId,
        productImage: data.image,
        desc: data.description,
        expiryTime: data.expiry,
      })
    );
    try {
      setLocalLoading(true);
      const product = await instances.addProduct(
        data.title,
        data.tokenId,
        data.image,
        data.description,
        data.expiry
      );
      console.log(`${product} merged to ${walletAddress}`);
      setLocalLoading(false);
    } catch (error) {
      console.error(error.message);
      setLocalLoading(false);
    }
  };
  return (
    <div>
      <Layout>
        <div className="authContainer">
          <div className="authcenter">
            <>
              <div className="txt">
                <h1 style={{ margin: "10px 0px" }}>Add Product Details</h1>
              </div>
              <Error />
              <InputBox
                name="image"
                type="file"
                title="Select Image"
                value={data.imgInput}
                handleChange={nftUpload}
                placeholder="Item Name"
                disabled={localLoading}
              />
              <InputBox
                name="title"
                title="Title"
                value={data.title}
                handleChange={handleChange}
                placeholder="Item Name"
                disabled={localLoading}
              />

              <label className="inputLabel">
                Description:
                <textarea
                  className="inputBox"
                  name="description"
                  value={data.description}
                  onChange={(e) => handleChange(e)}
                  placeholder="Provide detailed description of your item"
                  disabled={localLoading}
                />
              </label>
              <label className="inputLabel">
                <InputBox
                  name="expiry"
                  title="Expiry"
                  value={data.expiry}
                  handleChange={handleChange}
                  placeholder="Exipry Duration (in Months)."
                  disabled={localLoading}
                />
              </label>

              <div className="widthDiv">
                <button className="btn mintBtn" onClick={handleClick}>
                  {localLoading ? <Loader height="25" width="25" /> : "Mint"}
                </button>
              </div>
            </>
          </div>
        </div>
        <Success />
      </Layout>
    </div>
  );
}

export default Index;
