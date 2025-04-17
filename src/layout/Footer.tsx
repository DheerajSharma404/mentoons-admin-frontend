const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="flex justify-between items-center p-4 rounded-md shadow-lg">
      <h3 className="text-lg">© Mentoons 2024</h3>
      <button
        onClick={scrollToTop}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Top
      </button>
    </footer>
  );
};

export default Footer;
