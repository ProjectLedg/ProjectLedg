import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText } from "lucide-react"

export default function InvoiceUploader() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('invoice', selectedFile)
      formData.append('additionalInfo', additionalInfo)

      const response = await axios.post('/api/upload-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Upload successful:', response.data)
      // Here you might want to show a success message to the user
    } catch (error) {
      console.error('Upload failed:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">Invoice Uploader</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <Input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Label>
          </div>
          {selectedFile && (
            <div>
              <h3 className="font-semibold">Selected File:</h3>
              <p>{selectedFile.name}</p>
            </div>
          )}
          <div>
            <Label htmlFor="additionalInfo" className="font-semibold">
              Additional Information:
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Add any extra details about this invoice here..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="mt-1"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile || isLoading} 
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Uploading...' : 'Upload Invoice'}
        </Button>
      </CardFooter>
    </Card>
  )
}