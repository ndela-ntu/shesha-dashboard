const convertStringToFile = (
    dataUrl: string,
    defaultFileName: string
  ): File => {
    try {
      // Validate dataUrl format
      if (!dataUrl.includes(',')) {
        throw new Error('Invalid data URL format');
      }
  
      const [header, base64] = dataUrl.split(',');
      
      // Validate mime type
      const mimeMatch = header.match(/:(.*?);/);
      if (!mimeMatch) {
        throw new Error('Invalid MIME type in data URL');
      }
      
      const mimeType = mimeMatch[1] || 'application/octet-stream';
      const fileExtension = mimeType.split('/')[1] || 'bin';
  
      // Safely convert base64 to binary
      let binary: string;
      try {
        binary = atob(base64);
      } catch (e) {
        throw new Error('Invalid base64 encoding');
      }
  
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
  
      const fileName = `${defaultFileName}.${fileExtension}`;
      return new File([array], fileName, { type: mimeType });
    } catch (error) {
      throw new Error(`Failed to convert string to file: ${error}`);
    }
  };
  
  export default convertStringToFile;