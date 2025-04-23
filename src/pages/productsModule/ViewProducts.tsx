import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import {
  AudioComicProduct,
  ComicProduct,
  PodcastProduct,
  ProductBase,
  ProductType,
} from "../../types/productType";
import { errorToast } from "../../utils/toastResposnse";
const ViewProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductBase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${productId}`
        );
        if (!response.data) {
          throw new Error("Failed to fetch product");
        }

        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        errorToast("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
        <button
          onClick={() => navigate("/product-table")}
          className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 rounded hover:bg-blue-700 hover:scale-105"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const renderFilePreview = (file: string, type: "sample" | "file") => {
    const fileExtension = file.split(".").pop()?.toLowerCase();

    if (["mp3", "wav", "ogg", "mp4", "pdf"].includes(fileExtension || "")) {
      return (
        <audio controls className="w-full mt-2">
          <source src={file} type={`audio/${fileExtension}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (["mp4", "webm", "ogg"].includes(fileExtension || "")) {
      return (
        <video controls className="w-full mt-2 max-h-48">
          <source src={file} type={`video/${fileExtension}`} />
          Your browser does not support the video element.
        </video>
      );
    } else if (fileExtension === "pdf") {
      return (
        <embed src={file} type="application/pdf" className="w-full h-64 mt-2" />
      );
    } else {
      return (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-500 hover:text-blue-700"
        >
          View {type === "sample" ? "Sample" : "File"}
        </a>
      );
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <button
        onClick={() => navigate("/product-table")}
        className="flex items-center mb-6 text-blue-500 transition duration-300 ease-in-out hover:text-blue-700"
      >
        <FaArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            {product?.productImages.length > 0 ? (
              <img
                className="object-cover w-full h-48 md:w-48"
                src={product.productImages[0].imageUrl}
                alt={product.title}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-48 bg-gray-200 md:w-48">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
              {product?.type}
            </div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Product Title: {product?.title}
            </h1>
            <p className="mt-2 text-gray-600">
              Product Description: {product?.description}
            </p>

            <div className="mt-4">
              <h2 className="mb-2 text-xl font-semibold">Product Sample</h2>
              {product?.details &&
                (product.type === ProductType.WORKSHOP
                  ? null
                  : renderFilePreview(
                      (
                        product?.details as
                          | ComicProduct["details"]
                          | AudioComicProduct["details"]
                          | PodcastProduct["details"]
                      )?.sampleUrl || " ",
                      "sample"
                    ))}
            </div>
            <div className="mt-4">
              <h2 className="mb-2 text-xl font-semibold">Product File</h2>
              {product?.orignalProductSrc &&
                renderFilePreview(product?.orignalProductSrc, "file")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
