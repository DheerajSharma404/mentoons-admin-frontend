import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import DynamicTable from "../../components/common/Table";
import { Product } from "../../types";
import { ProductBase } from "../../types/productType";
import { headings } from "../../utils/constants";
import { errorToast, successToast } from "../../utils/toastResposnse";
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
  const { getToken } = useAuth();

  const editProduct = (row: ProductBase) => {
    navigate(`/add-products`, { state: { product: row } });
  };

  const removeProduct = (row: Product) => {
    setProductToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await axios.delete(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${productToDelete._id}`
        );

        if (response.status === 200) {
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== productToDelete._id
            )
          );
          console.log(response, "response");
          successToast("Product deleted successfully");
        } else {
          const errorData = response.data;
          throw new Error(
            `Failed to delete product: ${
              errorData.message || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        errorToast(
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
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products?search=${debouncedSearchTerm}&sortBy=createdAt&order=${sortOrder}&page=${currentPage}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response, "response");
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.total);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, [currentPage, limit, debouncedSearchTerm, getToken, sortOrder]);

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">All Products</h1>
      {isLoading ? (
        <Loader /> // Show loader while loading
      ) : (
        <>
          <DynamicTable
            headings={headings}
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
          productToDelete ? productToDelete.productTitle || "this product" : ""
        }
      />
    </div>
  );
};

export default ProductTable;
