import EXIF from "exif-js";

export enum Error {
  MISSING_TAGS,
  INVALID_IMAGE
}

function convertDMSToDD(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string //TODO: enum with the list of all possible directions
) {
  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }
  return dd;
}

export function extractPositionOfImage(
  file: File
): Promise<L.LatLngExpression> {
  return new Promise((resolve, reject) => {
    EXIF.getData(file, function(this: typeof EXIF.getData) {
      const latitude = EXIF.getTag<number[]>(this, "GPSLatitude");
      const longitude = EXIF.getTag<number[]>(this, "GPSLongitude");
      const latitudeRef = EXIF.getTag<string>(this, "GPSLatitudeRef");
      const longitudeRef = EXIF.getTag<string>(this, "GPSLongitudeRef");

      if (
        latitude == null ||
        longitude == null ||
        latitudeRef == null ||
        longitudeRef == null
      ) {
        reject({
          error: Error.MISSING_TAGS,
          file
        });
      }

      const position = [
        convertDMSToDD(latitude[0], latitude[1], latitude[2], latitudeRef),
        convertDMSToDD(longitude[0], longitude[1], longitude[2], longitudeRef)
      ] as L.LatLngExpression;

      // TODO: check bounds of [latitude, longitude]
      resolve(position);
    });
  });
}

export function inputToDataUrl(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener(
      "load",
      () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl);
      },
      false
    );

    reader.addEventListener("error", () => {
      reject({
        error: Error.INVALID_IMAGE,
        file
      });
    });

    reader.readAsDataURL(file);
  });
}
