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
      const unsafeLatitude = EXIF.getTag<number[]>(this, "GPSLatitude");
      const unsafeLongitude = EXIF.getTag<number[]>(this, "GPSLongitude");
      const unsafeLatitudeRef = EXIF.getTag<string>(this, "GPSLatitudeRef");
      const unsafeLongitudeRef = EXIF.getTag<string>(this, "GPSLongitudeRef");

      if (unsafeLatitude === undefined || unsafeLongitude === undefined) {
        return reject({
          error: Error.MISSING_TAGS,
          file
        });
      }

      const position = [
        convertDMSToDD(
          unsafeLatitude![0],
          unsafeLatitude![1],
          unsafeLatitude![2],
          unsafeLatitudeRef as string
        ),
        convertDMSToDD(
          unsafeLongitude![0],
          unsafeLongitude![1],
          unsafeLongitude![2],
          unsafeLongitudeRef as string
        )
      ] as L.LatLngExpression;

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
