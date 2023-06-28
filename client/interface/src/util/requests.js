export async function PostNrrdFile(formEntry, callback) {
    const RESPONSE = await fetch('http://localhost:8000/process_nrrd', {
      method: 'POST',
      body: formEntry
    });
  
    const fileBlob = await RESPONSE.blob();
  
    // Create a URL object from the file blob
    const fileURL = URL.createObjectURL(fileBlob);
    callback(fileURL);
    console.log(fileURL);
}