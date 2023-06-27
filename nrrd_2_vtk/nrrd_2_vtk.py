import nrrd
import vtk
from vtk.util import numpy_support

# Read the .nrrd file
nrrd_data, nrrd_header = nrrd.read('mask.nrrd')

# Create the image data
img = vtk.vtkImageData()
img.SetDimensions(nrrd_data.shape)
img.AllocateScalars(vtk.VTK_FLOAT, 1)

# Convert numpy array to vtkImageData
np_data = nrrd_data.ravel(order='F')
for i in range(len(np_data)):
    img.GetPointData().GetScalars().SetTuple1(i, np_data[i])

# Use Marching Cubes algorithm to generate the surface
dmc = vtk.vtkDiscreteMarchingCubes()
dmc.SetInputData(img)
dmc.GenerateValues(1, 1, 1)
dmc.Update()

# Write the .vtk file
writer = vtk.vtkPolyDataWriter()
writer.SetFileName('maskV.vtk')
writer.SetInputData(dmc.GetOutput())
writer.Write()
