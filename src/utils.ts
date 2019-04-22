export function inputToDataUrl(file: File): Promise<string> {
  console.log(file);
  const reader = new FileReader();

  return new Promise(resolve => {
    reader.addEventListener(
      "load",
      () => {
        resolve(reader.result as string);
      },
      false
    );

    reader.readAsDataURL(file);
  });
}
