import React, { useEffect, useState } from "react";
import { ChevronLeft,ChevronRight} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
const SubCategoriesList = () => {
  const { id, category } = useParams();
  const  BACKEND_API_URL = import.meta.env.VITE_BACKEND
  const navigate = useNavigate();
  useEffect(() => {
    fetchCategoryById();
  }, [id]);
  const [loading, setLoading] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const fetchCategoryById = async () => {
    setLoading(true);
    const response = await axios.get(
      `${BACKEND_API_URL}/search/categories`
    );
    const filterCategory = response.data.filter(
      (data) => data.parent === parseInt(id)
    );
    setSubCategoryData(filterCategory);
    setLoading(false);
  };
  if (loading) {
    return <center className="w-full h-[80vh] flex items-center justify-center"><span className="text-violet-700 font-bold text-[20px]">Loading<span className="text-yellow-600">...</span></span></center>;
  }
  const Home = () => {
    navigate("/");
  };

  return (
    <section>
      <div className="px-6">
        <div className=" w-full ">
          <div className="flex mt-[20px] items-center">
            <button onClick={Home}>
              <ChevronLeft className="" />
            </button>
            <h1 className="text-center text-violet-color flex-grow text-2xl">{category}</h1>
          </div>
        </div>
        <div className=" mt-16">
          {subCategoryData &&
            subCategoryData.map((data, index) => (
              <div key={index} className="flex items-center justify-center">
                <Link to={`/category/${data.category}`} className="pb-4 w-full mt-[10px] border-b">
                  <button className=" justify-between items-center text-[18px] flex w-full ">
                    <img src={data.categoryImage} alt="category" className="h-[50px]"/>
                    {data.category}

                    <ChevronRight className="ml-[30px] mt-1" />
                  </button>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SubCategoriesList;
