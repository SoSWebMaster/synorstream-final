import { Link } from "react-router-dom";

const NotFoundPage=()=>{
    return (
        <>
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
    <div className="p-8 text-center bg-white rounded-lg shadow-lg">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-6 text-xl text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>
      <img 
        src="https://via.placeholder.com/400x300?text=404+Not+Found" 
        alt="404" 
        className="mx-auto mb-6 rounded-md shadow-md"
      />
      <Link 
        to="/" 
        className="inline-block px-6 py-3 text-lg font-semibold text-white transition duration-300 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
      >
        Go Back to Home
      </Link>
    </div>
  </div>
        </>
    )
}

export default NotFoundPage;