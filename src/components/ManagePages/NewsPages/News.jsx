import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAuthorNewsRequest,
  nextPageAuthorNewsRequest,
  searchAuthorNewsRequest,
  searchNextPageAuthorNewsRequest,
} from "../../../actions/index";
import Pagination from "react-js-pagination";
import { ThreeDots } from "@agney/react-loading";
import NewsItem from "./NewsItem";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
class News extends Component {
  state = {
    access_token: null,
    loading: false,
    author_news: {},
    search: "",
  };
  alertError = (title, message) => {
    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "OK",
        },
      ],
    });
  };
  async componentDidMount() {
    var access_token = JSON.parse(localStorage.getItem("access_token"));
    const header = { Authorization: `Bearer ${access_token}` };
    await this.props.getAuthorNews(header);
    this.setState({
      author_news: this.props.author_news,
    });
  }
  nextPage = async (pageNumber) => {
    let { search } = this.state;
    this.setState({
      loading: true,
    });
    var access_token = JSON.parse(localStorage.getItem("access_token"));
    const header = { Authorization: `Bearer ${access_token}` };
    await this.props.searchAuthorNewsNextPage(header, search, pageNumber).catch((err) => {
      console.log(err);
      this.alertError(
        "Lỗi",
        "Phiên hết hạn, vui lòng đăng xuất rồi đăng nhập lại"
      );
      this.setState({
        loading: false,
      });
      // this.props.history.push('/login')
    });;
  };
  static getDerivedStateFromProps(props, state) {
    if (props.author_news !== state.author_news) {
      return {
        author_news: props.author_news,
        loading: false,
      };
    }
    return null;
  }
  renderPagination = () => {
    var { author_news } = this.state;
    var { current_page, per_page, total} = author_news;
    return (
      <Pagination
        activePage={current_page}
        totalItemsCount={total}
        itemsCountPerPage={per_page}
        onChange={(pageNumber) => this.nextPage(pageNumber)}
        itemClass="page-item"
        linkClass="page-link"
        firstPageText={"Đầu"}
        lastPageText={"Cuối"}
      />
    );
  };
  onEnter = async (e) => {
    if (e.keyCode === 13) {
      await this.onSearch();
    }
  };
  onChange = (e) => {
    var search = e.target.value;
    this.setState({ search });
  };
  onSumbit = async (e) => {
    await this.onSearch();
  };
  onSearch = async () => {
    var { search } = this.state;
    var access_token = JSON.parse(localStorage.getItem("access_token"));
    const header = { Authorization: `Bearer ${access_token}` };
    this.setState({ loading: true });
    await this.props.searchAuthorNews(header, search).catch((err) => {
      console.log(err);
      this.alertError(
        "Lỗi",
        "Phiên hết hạn, vui lòng đăng xuất rồi đăng nhập lại"
      );
      this.setState({
        loading: false,
      });
      // this.props.history.push('/login')
    });;
  };
  render() {
    var { loading, author_news, search } = this.state;
    var {from, to, total} = author_news;
    var inShowing =
      "Showing " + from + " to " + to + " of " + total + " entries";
    if (author_news.data) {
      var list_news = author_news.data.map((news, index) => {
        return <NewsItem news={news} key={index} />;
      });
    }
    return (
      <div className="dashboard-wrapper">
        {loading === true ? (
          <ThreeDots color="#00BFFF" height="800" width="100%" />
        ) : (
          <div className="container-fluid  dashboard-content">
            {/* ============================================================== */}
            {/* pageheader */}
            {/* ============================================================== */}
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="page-header">
                  <h2 className="pageheader-title">{"Bài viết cá nhân"}</h2>
                  <div className="page-breadcrumb">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link to="/" className="breadcrumb-link">
                            {"Trang chủ"}
                          </Link>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="#" className="breadcrumb-link">
                            {"Quản lý"}
                          </a>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          {"Bài viết cá nhân"}
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================== */}
            {/* end pageheader */}
            {/* ============================================================== */}
            <div className="row">
              {/* ============================================================== */}
              {/* basic table  */}
              {/* ============================================================== */}
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <div
                        id="DataTables_Table_0_wrapper"
                        className="dataTables_wrapper dt-bootstrap4"
                      >
                        <div className="row">
                          <div className="col-sm-12 col-md-6 col-lg-8 mb-2">
                            <div
                              id="DataTables_Table_0_filter"
                              className="dataTables_filter"
                            >
                              <label>
                                Tìm kiếm:
                                <input
                                  type="search"
                                  className="form-control form-control-sm"
                                  placeholder={"Nhập tiêu đề, tóm tắt"}
                                  aria-controls="DataTables_Table_0"
                                  onKeyDown={(e) => this.onEnter(e)}
                                  onChange={(e) => this.onChange(e)}
                                  defaultValue={search}
                                />
                              </label>
                              <button
                                className="ml-2"
                                onClick={(e) => this.onSumbit(e)}
                              >
                                <i
                                  className="fa fa-search"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                            <div
                              id="DataTables_Table_0_filter"
                              className="dataTables_filter"
                            >
                              <Link
                                to="/management/news/create"
                                data-toggle="tooltip"
                                title={"Thêm bài viết"}
                              >
                                <i
                                  className="fa fa-plus fa-2x"
                                  style={{
                                    float: "right",
                                    marginTop: "6%",
                                    color: "#00ff00",
                                  }}
                                  aria-hidden="true"
                                ></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-sm-12">
                            <table
                              className="table table-striped table-bordered first dataTable"
                              id="DataTables_Table_0"
                              role="grid"
                              aria-describedby="DataTables_Table_0_info"
                            >
                              <thead>
                                <tr role="row">
                                  <th
                                    className="sorting_asc"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-sort="ascending"
                                    aria-label="Name: activate to sort column descending"
                                    style={{ width: "30px" }}
                                  >
                                    ID
                                  </th>
                                  <th
                                    className="sorting_asc"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-sort="ascending"
                                    aria-label="Name: activate to sort column descending"
                                    style={{ width: "200px" }}
                                  >
                                    Tiêu đề
                                  </th>
                                  <th
                                    className="sorting_asc"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-sort="ascending"
                                    aria-label="Name: activate to sort column descending"
                                    style={{ width: "200px" }}
                                  >
                                    Ảnh tiêu đề
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Position: activate to sort column ascending"
                                    style={{ width: "200px" }}
                                  >
                                    Tóm tắt
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Position: activate to sort column ascending"
                                    style={{ width: "300px" }}
                                  >
                                    Nội dung
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Position: activate to sort column ascending"
                                    style={{ width: "100px" }}
                                  >
                                    Nhãn
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Position: activate to sort column ascending"
                                    style={{ width: "150px" }}
                                  >
                                    Danh mục
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Position: activate to sort column ascending"
                                    style={{ width: "10px" }}
                                  >
                                    Tin nóng
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Position: activate to sort column ascending"
                                    style={{ width: "10px" }}
                                  >
                                    Duyệt
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="DataTables_Table_0"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Start date: activate to sort column ascending"
                                    style={{ width: "6%" }}
                                  >
                                    Hành động
                                  </th>
                                </tr>
                              </thead>
                              <tbody>{list_news}</tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 col-md-5">
                            <div
                              className="dataTables_info"
                              id="DataTables_Table_0_info"
                              role="status"
                              aria-live="polite"
                            >
                              {inShowing}
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-7">
                            <div
                              className="dataTables_paginate paging_simple_numbers"
                              id="DataTables_Table_0_paginate"
                            >
                              {this.renderPagination()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ============================================================== */}
              {/* end basic table  */}
              {/* ============================================================== */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    author_news: state.author_news,
  };
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    getAuthorNews: (header) => {
      return dispatch(getAuthorNewsRequest(header));
    },
    nextPage: (header, pageNumber) => {
      return dispatch(nextPageAuthorNewsRequest(header, pageNumber));
    },
    searchAuthorNews: (header, keyword) => {
      return dispatch(searchAuthorNewsRequest(header, keyword));
    },
    searchAuthorNewsNextPage: (header, keyword, pageNumber) => {
      return dispatch(
        searchNextPageAuthorNewsRequest(header, keyword, pageNumber)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
