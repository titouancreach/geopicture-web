import React, { useState } from "react";
import "./App.css";

import { Layout, Button, Upload, Icon } from "antd";

const { Header, Content, Sider } = Layout;

import World, { IPhoto } from "./World";
import { RcFile } from "antd/lib/upload/interface";
import { inputToDataUrl, extractPositionOfImage } from "./utils";

function App() {
  const [photoList, setPhotoList] = useState<IPhoto[]>([]);

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
          <World photos={photoList} />
        </Content>
        <Sider style={{ background: "white" }} className="z-1 shadow-1 pa3">
          <div className="w-100 tc">
            <Upload
              name="images"
              customRequest={async ({
                file,
                onSuccess,
                onError
              }: {
                file: RcFile;
                onSuccess: Function;
                onError: Function;
              }) => {
                try {
                  const url = await inputToDataUrl(file);
                  const position = await extractPositionOfImage(file);
                  const { uid } = file;

                  const photo = {
                    position,
                    url,
                    uid,
                    file
                  };
                  setPhotoList([...photoList, photo]);
                  onSuccess();
                } catch (e) {
                  onError(e);
                }
              }}
              onRemove={file => {
                const newPhotoList = photoList.filter(p => {
                  return file.originFileObj !== p.file;
                });
                setPhotoList(newPhotoList);
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
