import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { successToast, errorToast } from '../../utils/toastResposnse';
import { AuthorData } from '../../types';

interface AddAuthorFormProps {
  setModalOpen: any;
  setAuthors:(author:AuthorData[])=>void;
  authors:AuthorData[]
}

const AddAuthorForm = ({ setModalOpen,setAuthors,authors }:AddAuthorFormProps) => {
  const { getToken } = useAuth();

  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; image?: string } = {};
    if (!name) newErrors.name = 'Author name is required';
    if (!image) newErrors.image = 'Author image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append('file', image!);
  
      const token = await getToken();
      if (!token) {
        throw new Error('Token not found');
      }
  
      // Upload the image
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/upload/file`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const uploadData = await response.json();
      const imageUrl = uploadData.data.imageUrl;
  
      // Add the author
      const authorData: Omit<AuthorData, '_id'> = {
        name,
        image: imageUrl,
      };
  
      const authorResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/author`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(authorData),
      });
  
      if (authorResponse.ok) {
        const newAuthor: { data: AuthorData } = await authorResponse.json();
        console.log(newAuthor,'llll')
  
        successToast('Author added successfully');
        setAuthors([...authors, newAuthor.data])
        setModalOpen(false);
      } else {
        throw new Error('Failed to add author');
      }
    } catch (error: any) {
      errorToast(error?.message || 'Failed to add author');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Author</h1>
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files ? event.target.files[0] : null)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Adding...' : 'Add Author'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="py-3 px-6 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuthorForm;
