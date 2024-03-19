import  { React, useState,useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [article, setArticle] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(0);
  const [totalResults, settotalResults] = useState(0);


 const capatalizeFirstLetter = (string) => {
    /*to capatalize the first letter*/
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async ()=> {


    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=9c80f774a6394ea4a445995782b45972&page=${page}&pageSize=${props.pageSize}`; 
    setloading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(70);
    setArticle(parsedData.articles)
    settotalResults(parsedData.totalResults)
    setloading(false)
    props.setProgress(100);
}

  useEffect(() => {
    document.title = `${capatalizeFirstLetter(
      props.category
    )} -NewsMonkey`;
    updateNews();
  }, []);

  const fetchMoreData = async () => {   
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=9c80f774a6394ea4a445995782b45972&page=${page+1}&pageSize=${props.pageSize}`;
    setpage(page+1) 
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticle(article.concat(parsedData.articles))
    settotalResults(parsedData.totalResults)
  };

  return (
    <>
      <h1 style={{width:"90%" ,justifyContent:'center', alignContent:'center',marginLeft:'5%',marginTop:"65px"}}>
        <b>
          NewsBugs TopHeadlines on {capatalizeFirstLetter(props.category)}
        </b>
      </h1>
      {loading && <Spinner />}

      <InfiniteScroll /*for InfiniteScroll visit this link = https://codesandbox.io/p/sandbox/yk7637p62z?file=%2Fsrc%2Findex.js%3A3%2C1-3%2C62*/
        dataLength={article.length}
        next={fetchMoreData}
        hasMore={article.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {article.map((element) => {
              return (
                <div className="col-md-4">
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : ""
                    }
                    imageUrl={
                      !element.urlToImage
                        ? "data:image/png;base64,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"
                        : element.urlToImage
                    }
                    newsUrl={element.url}
                    publishedAt={element.publishedAt}
                    author={element.author}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>



      {/*Previous and Next button 
         <div className="container d-flex justify-content-between">
          <button
            type="button"
            disabled={state.page <= 1}
            className="btn btn-warning m-5"
            onClick={handlePrevClick}
          >
            <b>&larr; Previous</b>
          </button>
          <button
            type="button"
            className="btn btn-primary m-5"
            onClick={handleNextClick}
            disabled={totalResults / props.pageSize}
          >
            <b>Next &rarr;</b>
          </button>
        </div> */}
    </>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}
export default News;
