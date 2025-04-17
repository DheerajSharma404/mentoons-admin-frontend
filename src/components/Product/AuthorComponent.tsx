import { ErrorMessage, FormikHelpers } from 'formik';
import { AuthorData } from '../../types';
import {useState } from 'react';
import AddAuthorForm from './AddAuthorForm';

interface AuthorCompProps {
  authors: AuthorData[];
  setFieldValue: FormikHelpers<any>['setFieldValue'];
  setAuthors:(author:AuthorData[])=>void;
}

const AuthorDropdown = ({ authors, setFieldValue,setAuthors }: AuthorCompProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>('');
  const [modalOpen,setModalOpen]=useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (authorId: string) => {
    if (authorId === 'add-author') {
       setModalOpen(true)
    } else {
      setSelectedAuthor(authorId);
      setFieldValue('author', authorId);
      setIsOpen(false);
    }
  };

  return (
    <>
    {modalOpen && <AddAuthorForm  setModalOpen={setModalOpen} setAuthors={setAuthors} authors={authors}/>}
    <div className="space-y-2">
      <label htmlFor="author" className="block text-sm font-medium text-gray-700">
        Author
      </label>
      <div className="relative">
        <div
          className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer"
          onClick={toggleDropdown}
        >
          <span>
            {selectedAuthor
              ? authors.find((author) => author._id === selectedAuthor)?.name
              : 'Select an author'}
          </span>
          <span className="text-gray-500">{isOpen ? '▲' : '▼'}</span>
        </div>

        {isOpen && (
          <div className="absolute w-full bg-white shadow-lg border border-gray-300 mt-1 z-10">
            <div
              onClick={() => handleSelect('')}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              <span>Select an author</span>
            </div>

            {authors.map((author) => (
              <div
                key={author._id}
                onClick={() => handleSelect(author._id)}
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <span>{author.name}</span>
              </div>
            ))}

            <div
              onClick={() => handleSelect('add-author')}
              className="px-4 py-2 text-blue-600 font-semibold hover:bg-gray-200 cursor-pointer"
            >
              + Add New Author
            </div>
          </div>
        )}

        <ErrorMessage name="author" component="div" className="text-red-500 text-sm" />
      </div>
    </div>
    </>
  );
};

export default AuthorDropdown;
