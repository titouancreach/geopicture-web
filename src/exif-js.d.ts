declare module "exif-js" {
  function getData(file: File, callback: any): any;
  function getTag<T>(thisCtx: any, tagName: string): T | undefined;
}
