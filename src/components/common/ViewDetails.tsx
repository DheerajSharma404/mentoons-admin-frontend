import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ViewDetailsProps {
  id: string;
  type: 'product' | 'job' | 'jobApplication';
}

const ViewDetails: React.FC<ViewDetailsProps> = ({ id, type }) => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/${type}/${id}`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  const renderField = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  const getTitle = () => {
    switch (type) {
      case 'product':
        return 'Product Details';
      case 'job':
        return 'Job Details';
      case 'jobApplication':
        return 'Job Application Details';
      default:
        return 'Details';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <div className="bg-gray-100 p-2 rounded">
              {renderField(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDetails;
