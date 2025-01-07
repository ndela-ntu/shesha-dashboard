const convertStringToFile = (
  dataUrl: string,
  defaultFileName: string
): File => {
  const [header, base64] = dataUrl.split(",");
  const mimeType = header.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const fileExtension = mimeType.split("/")[1] || "bin"; // Extract file extension
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  const fileName = `${defaultFileName}.${fileExtension}`;
  return new File([array], fileName, { type: mimeType });
};

export default convertStringToFile;
