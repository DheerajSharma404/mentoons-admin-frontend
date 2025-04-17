import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { FaArrowLeft } from 'react-icons/fa';
import { errorToast } from '../../utils/toastResposnse';
import Loader from '../../components/common/Loader';
const ViewProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
       errorToast('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    }, [productId]);

  if (loading) {
    return <Loader />
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/product-table')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const renderFilePreview = (file: string, type: 'sample' | 'file') => {
    const fileExtension = file.split('.').pop()?.toLowerCase();
    
    if (['mp3', 'wav', 'ogg'].includes(fileExtension || '')) {
      return (
        <audio controls className="w-full mt-2">
          <source src={file} type={`audio/${fileExtension}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension || '')) {
      return (
        <video controls className="w-full mt-2 max-h-48">
          <source src={file} type={`video/${fileExtension}`} />
          Your browser does not support the video element.
        </video>
      );
    } else if (fileExtension === 'pdf') {
      return (
        <embed src={file} type="application/pdf" className="w-full h-64 mt-2" />
      );
    } else {
      return (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
        >
          View {type === 'sample' ? 'Sample' : 'File'}
        </a>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/product-table')}
        className="mb-6 flex items-center text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
      >
        <FaArrowLeft className="h-5 w-5 mr-2" />
        Back to Products
      </button>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {product?.productThumbnail ? (
              <img
                className="h-48 w-full object-cover md:w-48"
                src={product.productThumbnail}
                alt={product.productTitle}
              />
            ) : (
              <div className="h-48 w-full md:w-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {product?.productCategory}
            </div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">Product Title: {product?.productTitle}</h1>
            <p className="mt-2 text-gray-600">Product Description: {product?.productDescription}</p>
            <div className="mt-2 flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer">Author:  {product?.author && product.author.length > 0 ?<> <img
                  src={ product.author[0]?.image}
                  alt={ product.author[0]?.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <span>{ product.author[0]?.name}</span></> : 'Unknown'}</div>      
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Product Sample</h2>
              {product?.productSample && renderFilePreview(product.productSample, 'sample')}
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Product File</h2>
              {product?.productFile && renderFilePreview(product.productFile, 'file')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;