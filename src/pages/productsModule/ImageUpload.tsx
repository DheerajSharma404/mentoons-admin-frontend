import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { toast } from "sonner";

const ImageUpload = ({
  onImageUpload,
  multiple = false,
}: {
  onImageUpload: (urls: string | string[]) => void;
  multiple?: boolean;
}) => {
  const [uploading, setUploading] = useState(false);
  const { getToken } = useAuth();
  // Define interface for the API response
  interface UploadResponse {
    urls: string[];
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setUploading(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      files.forEach((file: File) => {
        formData.append("file", file);
      });

      const response = await fetch(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        toast.success("Image uploaded successfully");
      }

      const data = (await response.json()) as UploadResponse;
      onImageUpload(multiple ? data.urls : data.urls[0]);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        onChange={handleImageChange}
        multiple={multiple}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </label>
    </div>
  );
};

export default ImageUpload;
