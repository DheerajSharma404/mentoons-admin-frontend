import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import DynamicTable from "../../components/common/Table";
import { Product } from "../../types";
import axios from "axios";

const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const editProduct = (row: Product) => {
    navigate(`/add-products`, { state: { product: row } });
  };

  const removeProduct = (row: Product) => {
    setProductToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/products/${productToDelete._id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== productToDelete._id
            )
          );
          console.log(response, "response");
          toast.success("Product deleted successfully");
        } else {
          const errorData = await response.json();
          throw new Error(
            `Failed to delete product: ${
              errorData.message || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete product"
        );
      }
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const viewProduct = (row: Product) => {
    console.log(row._id, "row");
    navigate(`/products/${row._id}`);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/products`,
          {
            params: {
              limit,
              page: currentPage,
              sort: sortOrder,
              search: debouncedSearchTerm,
            },
          }
        );

        const result = response.data;
        console.log(result.data, "osoo");

        if (Array.isArray(result.data) && result.data.length > 0) {
          const productDetails = result.data.map((p: Product) => {
            const authorOrNarrator = p.details.host
              ? p.details.host
              : "narrator" in p.details
              ? p.details.narrator
              : "author" in p.details
              ? p.details.author
              : "";
            return {
              _id: p._id,
              title: p.title,
              description: p.description,
              ageCategory: p.ageCategory,
              productThumbnail: p.productImages[0]?.imageUrl,
              productFile: p.orignalProductSrc,
              author: authorOrNarrator,
            };
          });
          setProducts(productDetails);
          setTotalPages(result.data.totalPages);
          setTotalProducts(result.data.length);
        } else {
          toast.error("Fetched data is not in the expected format");
          console.error("Fetched data is not in the expected format:", result);
          setProducts([]);
        }
      } catch (error) {
        toast.error("Error fetching products");
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit, currentPage, sortOrder, debouncedSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DynamicTable
            data={products}
            onEdit={editProduct}
            onDelete={removeProduct}
            onView={viewProduct}
            sortField="createdAt"
            onSort={handleSort}
            sortOrder={sortOrder}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProducts}
            limit={limit}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={
          productToDelete ? productToDelete.title || "this product" : ""
        }
      />
    </div>
  );
};

export default ProductTable;
