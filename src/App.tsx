import React, { useState } from "react";
import "./App.css";

import { Layout, Button, Tooltip, Upload, Slider, Icon } from "antd";

const { Header, Content, Sider } = Layout;

import World, { IPhoto } from "./World";
import { RcFile } from "antd/lib/upload/interface";

function App() {
  const [fileList, setFileList] = useState<RcFile[]>([]);

  return (
    <Layout>
      <Header
        className="flex items-center justify-between bg-white shadow-1 z-2"
        style={{ background: "white" }}
      >
        <h1 className="f3 ma0 o-80">Geopicture</h1>
      </Header>
      <Layout>
        <Content>
          <World files={fileList} />
        </Content>
        <Sider style={{ background: "white" }} className="z-1 shadow-1 pa3">
          <div className="w-100 tc">
            <Upload
              name="images"
              beforeUpload={(file: RcFile) => {
                setFileList([...fileList, file]);
                return false;
              }}
              onRemove={file => {
                const newFileList = fileList.filter(f => {
                  return file.originFileObj !== f;
                });
                setFileList(newFileList);
              }}
              multiple
            >
              <Button className="ma2 mt0">
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
}

export default App;
