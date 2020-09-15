/*global chrome*/

import React from "react";
import "./App.css";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";

const fetchData = async (currentURL) => {
  //fetch for card
  try {
    const mainURL =
      "https://us-central1-technews-251304.cloudfunctions.net/article-parser?url=";
    const fullURL = mainURL + currentURL;
    const response = await axios.get(fullURL);
    return response;
  } catch (error) {}
};

const fetchNews = async (str) => {
  //fetch for news
  try {
    const newsURL1 =
      "https://bagged-pylon-24980.herokuapp.com/https://api.newsriver.io/v2/search?query=text%3A";
    const newsURL2 =
      "%20AND%20language%3AEN&sortBy=_score&sortOrder=DESC&limit=15";
    const newsURL = newsURL1 + str + newsURL2;
    const AuthStr =
      "sBBqsGXiYgF0Db5OV5tAw-xoHd5AHPAAgCf-aQy4GJGUEYkfj8-MovCSZAC-HGxLn2pHZrSf1gT2PUujH1YaQA";
    const response = await axios.get(newsURL, {
      headers: { Authorization: AuthStr, crossorigin: true },
    });
    return response;
  } catch (error) {}
};

function URLify(string) {
  return string.trim().replace(/\s/g, "%20");
}

class App extends React.Component {
  state = {
    reqData: {},
    reqNews: [],
    URLencoded: "",
    currentURL: "",
  };

  //async componentDidMount() {
  //  chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
  //    this.setState({ currentURL: tab[0].url });
  //  });
  //}

  render() {
    const { reqData } = this.state;
    var { reqNews } = this.state;
    var { URLencoded } = this.state;
    var { currentURL } = this.state;

    if (Object.keys(currentURL).length === 0) {
      chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tab) {
          this.setState({ currentURL: tab[0].url });
        }.bind(this)
      );
    }
    if (Object.keys(currentURL).length !== 0 && !reqData.title) {
      fetchData(currentURL)
        .then((result) => {
          // got final result
          this.setState({ reqData: result.data.data });
          console.log("reqData has its state set!");
          console.log(reqData);
        })
        .catch((err) => {
          // got error
          console.log("This is an error");
        });
    }

    if (Object.keys(reqData).length !== 0 && !reqNews[0]) {
      URLencoded = URLify(reqData.title);
      fetchNews(URLencoded)
        .then((result) => {
          // got final result
          this.setState({ reqNews: result.data });
          console.log("reqNews has its state set!");
        })
        .catch((err) => {
          // got error
          console.log("This is the error");
        });
    }

    return (
      <div>
        {
          !reqNews[0] && (
            <div className="App-header">
              <Card className="text-center" style={{ width: "20rem" }}>
                <Card.Body>
                  <Card.Title>Welcome to IntelliNews</Card.Title>
                  <Card.Text>
                    Want to find out more about a news headline? Want to
                    crosscheck the details in a news report? Read all sides of
                    the story with intelligent news recommendations from
                    thousands of news sources based on article being currently
                    read
                  </Card.Text>
                  <Card.Text>
                    Please wait for a few seconds as a reading list is being
                    curated for you based on your current article
                  </Card.Text>
                  <Card.Text>
                    <Spinner animation="border" variant="dark" />
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <Badge pill variant="danger">
                    Developed by Shahnawaz Mogal
                  </Badge>
                </Card.Footer>
              </Card>
            </div>
          ) //In case API call is taking time
        }
        {reqNews[0] && (
          <div className="App-header">
            <Card className="text-center" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Welcome to IntelliNews</Card.Title>

                <Card.Text>⇩Read all sides of the story⇩</Card.Text>
              </Card.Body>
            </Card>
            {reqNews.map((item) => {
              return (
                <Card style={{ width: "20rem" }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.elements[0] && (
                      <div>
                        <Card.Img variant="top" src={item.elements[0].url} />
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>
                        <h5>
                          {item.website && (
                            <div>
                              <Badge variant="secondary">
                                {item.website.name.substring(0, 30)}
                              </Badge>
                            </div>
                          )}
                          {item.metadata.readTime && (
                            <div>
                              <Badge pill variant="info">
                                Reading Time: {item.metadata.readTime.seconds}s
                              </Badge>
                            </div>
                          )}
                        </h5>
                      </Card.Text>
                    </Card.Body>
                  </a>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default App;
