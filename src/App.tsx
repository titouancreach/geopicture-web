import React, { useState } from "react";
import "./App.css";

import { Layout, Button, Upload, Icon } from "antd";

const { Header, Content, Sider } = Layout;

import World, { IPhoto } from "./World";
import { RcFile } from "antd/lib/upload/interface";
import { inputToDataUrl, extractPositionOfImage } from "./utils";
import { Viewport } from "react-leaflet";

function App() {
  const [photoList, setPhotoList] = useState<IPhoto[]>([]);

  const [viewport, setViewport] = useState<Viewport>({
    center: [48.8534, 2.3488],
    zoom: 13
  });

  return (
    <Layout>
      <Header
        className="flex items-center justify-between bg-white shadow-1 z-2"
        style={{ background: "white" }}
      >
        <h1 className="f3 ma0 o-80">Geopicture</h1>
        <Button
          shape="circle"
          icon="github"
          href="https://github.com/titouancreach/studious-garbanzo"
        />
      </Header>
      <Layout>
        <Content>
          <World
            photos={photoList}
            viewport={viewport}
            onViewportChange={e => {
              setViewport(e);
            }}
          />
        </Content>
        <Sider style={{ background: "white" }} className="z-1 shadow-1 pa3">
          <div className="w-100 tc">
            <Upload
              name="images"
              onPreview={file => {
                const photo = photoList.find(photo => photo.uid === file.uid);
                const position = photo!.position as [number, number]; // Love totally broken leaflet types <3
                setViewport({
                  zoom: 20,
                  center: position
                });
              }}
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
                  setPhotoList(prevPhotoList => [...prevPhotoList, photo]);
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
