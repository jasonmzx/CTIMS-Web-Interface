from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import nrrd
import numpy as np
import os
import tempfile

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/process_nrrd")
async def process_nrrd(file: UploadFile = File(...)):
    # Save the temporary file to disk
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp_file_name = tmp.name

    # Read uploaded nrrd file
    data, header = nrrd.read(tmp_file_name)

    # Process the data here as needed, for example, let's just return it as is.
    # Write the nrrd file to a local file
    output_path = os.path.join('processed_files', f"{file.filename}")
    nrrd.write(output_path, data, header)

    # Remove the temporary file
    os.unlink(tmp_file_name)

    reponse_path = os.path.join('nrrd_ressources', "mask.nrrd")

    return FileResponse(reponse_path, media_type="application/octet-stream", filename=file.filename)

@app.get("/ping")
async def ping_server():
    return {"message": "API Gateway is Running !"}