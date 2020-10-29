import EXIF from "exif-js";

import { GeoTagsMissing, InvalidImage } from "./exceptions";

type Direction = "W" | "S" | "N" | "E";

function convertDMSToDD(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: Direction
) {
  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

export async function extractPositionOfImage(
  file: File
): Promise<L.LatLngExpression> {

  const exifData = (await new Promise((resolve) =>
    EXIF.getData(file, function(this: typeof EXIF.getData) {
      resolve(EXIF.getAllTags(this));
    })
  )) as any;

  const unsafeLatitude = exifData["GPSLatitude"] as number[] | undefined;
  const unsafeLongitude = exifData["GPSLongitude"] as number[] | undefined;
  const unsafeLatitudeRef = exifData["GPSLatitudeRef"] as Direction;
  const unsafeLongitudeRef = exifData["GPSLongitudeRef"] as Direction;

  if (unsafeLatitude === undefined || unsafeLongitude === undefined) {
    throw new GeoTagsMissing();
  }

  const position = [
    convertDMSToDD(
      unsafeLatitude![0],
      unsafeLatitude![1],
      unsafeLatitude![2],
      unsafeLatitudeRef
    ),
    convertDMSToDD(
      unsafeLongitude![0],
      unsafeLongitude![1],
      unsafeLongitude![2],
      unsafeLongitudeRef
    ),
  ] as L.LatLngExpression;

  return position;
}

export function inputToDataUrl(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.addEventListener(
      "load",
      () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl);
      },
      false
    );

    reader.addEventListener("error", () => {
      throw new InvalidImage();
    });

    reader.readAsDataURL(file);
  });
}
