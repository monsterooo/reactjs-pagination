import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { range } from './utils';
import './style.scss';

class Pagination extends Component {
	static propTypes = {
		currentPage: PropTypes.number,
		pagesPage: PropTypes.bool,
		totalNumber: PropTypes.number,
		pageSize: PropTypes.number,
		middlePage: PropTypes.number,

		showGo: PropTypes.bool,
		showPages: PropTypes.bool,
		showPrev: PropTypes.bool,
		showNext: PropTypes.bool
	}
	static defaultProps = {
		currentPage: 1,
		pagesPage: true,
		middlePage: 5,

		showGo: false,
		showPages: true,
		showPrev: false,
		showNext: false
	};
	state = {
		currentPage: this.props.currentPage,
		pageCount: Math.ceil(this.props.totalNumber / this.props.pageSize)
	};
	constructor(props) {
		super(props);
	}
	componentWillReceiveProps(nextProps) {
		const { onChange } = this.props;

		// 更新当前页码
		if(nextProps.currentPage !== this.props.currentPage) {
			this.setState({
				currentPage: nextProps.currentPage
			});
			onChange && onChange(nextProps.currentPage);
		}
		// 更新总数
		if(nextProps.totalNumber !== this.props.totalNumber) {
			let pageCount = Math.ceil(nextProps.totalNumber / nextProps.pageSize);
			// 重新更新了总数，判断页码是否在总页码范围内，如果不在则重置当前页码为1
			if(this.state.currentPage > pageCount) {
				this.setState({
					pageCount: pageCount,
					currentPage: 1
				});
				onChange && onChange(1);
			} else {
				this.setState({
					pageCount: pageCount
				});
				onChange && onChange(this.props.currentPage);
			}
		}
	}
	// 页码
	renderPages() {
		const { showPrev, showNext, pagesPage, showPages } = this.props;
		const { currentPage, pageCount } = this.state;
		let _className;
		let ret = [];

		if(showPrev) {
			_className = classnames('ms-pagination-prevPage');
			if(currentPage === 1) {
				_className = classnames('ms-pagination-disabled', _className);
			}
			ret.push(<li onClick={this.handlePrevPage} className={_className} key="ms-pagination-prevPage">«</li>);
		}
		if(pagesPage && showPages) {
			ret = ret.concat(this.caclePages());
		}
		if(showNext) {
			_className = classnames('ms-pagination-nextPage');
			if(currentPage === pageCount) {
				_className = classnames('ms-pagination-disabled');
			}
			ret.push(<li onClick={this.handleNextPage} className={_className} key="ms-pagination-nextPage">»</li>);
		}
		return ret;
	}
	// 页码点击跳转
	handlePageClick = (idx) => {
		if(idx === this.state.currentPage) {
			return;
		}
		this.jumpPage(idx);
	}
	// 上一页
	handlePrevPage = () => {
		const { currentPage } = this.state;
		if(currentPage > 1) {
			this.jumpPage(currentPage - 1);
		}
	}
	// 下一页
	handleNextPage = () => {
		const { currentPage, pageCount } = this.state;
		if(currentPage < pageCount) {
			this.jumpPage(currentPage + 1);
		}
	}
	// 跳转到某一页
	handleGo = () => {
		const { currentPage, pageCount } = this.state;
		let inputPage = this.refs.msPaginationGoInput && this.refs.msPaginationGoInput.value;

		// 输入页码必须为数字
		if(!/^(\d)+$/.test(inputPage)) {
			return;
		}
		inputPage = parseInt(inputPage);
		if(inputPage < 1 && pageCount > 1) {
			return;
		}
		if(inputPage > pageCount) {
			return;
		}
		if(inputPage === this.state.currentPage) {
			return;
		}
		this.jumpPage(inputPage);
	}
	jumpPage(idx) {
		const { onChange } = this.props;
		onChange && onChange(idx);
		this.setState({
			currentPage: idx
		});
	}
	// 计算页码，返回页码元素
	caclePages() {
		const { totalNumber, pageSize, middlePage } = this.props;
		const { currentPage, pageCount } = this.state;
		let fixPage = 0;										// 根据middlePage修正页码
		let viewPageStart = 0;									// 中间页码开始
		let viewPageEnd = 0;									// 中间页码结束
		let ret = [];

		// 中间页码修正，middlePage为偶数，viewPageEnd需要减1
		fixPage = middlePage % 2 == 0 ? 1 : 0;

		if(currentPage <= middlePage) {
			// 检测前边界值
			viewPageStart = 1;
			viewPageEnd = middlePage + Math.floor(middlePage / 2);
		} else if(currentPage >= pageCount - Math.floor(middlePage / 2) - 1) {	// -1 是为了最后一页显示6条分页数据 32..33 是不合理的 应该是 32 33
			// 检测后边界值
			viewPageStart = pageCount - middlePage;
			viewPageEnd = pageCount;
		} else {
			// middlePage在中间
			viewPageStart = currentPage - Math.floor(middlePage / 2);
			viewPageEnd = currentPage + Math.floor(middlePage / 2) - fixPage;
		}

		// 检测是否显示第一页和第一页后面的省略号
		if(viewPageStart > 2) {
			ret.push(<li key={'pagination-first'} onClick={this.handlePageClick.bind(this, 1)}>1</li>);
			ret.push(<li key={'pagination-firt-dot'} className="ms-pagination-dot">...</li>);
		}
		//console.log('currentPage -> ', currentPage, ', pm -> ', pageCount - Math.floor(middlePage / 2));
		//console.log('viewPageStart -> ', viewPageStart, ', viewPageEnd -> ', viewPageEnd);

		range(viewPageStart, viewPageEnd + 1).map((index, key) => {
			let _className = '';
			if(index == currentPage) {
				_className = 'ms-pagination-current';
			}
			ret.push(<li onClick={this.handlePageClick.bind(this, index)} key={'pagination-' + key} className={_className}>{index}</li>);
		});

		if(viewPageEnd != pageCount) {
			ret.push(<li key={'pagination-last'} className="ms-pagination-dot">...</li>);
			ret.push(<li key={'pagination-last-dot'} onClick={this.handlePageClick.bind(this, pageCount)}>{pageCount}</li>);
		}
		return ret;
	}
	renderGo() {

	}
	render() {
		const { showGo } = this.props;

		return (
			<div className="ms-pagination">
				<div className="ms-pagination-pages">
					<ul>
						{this.renderPages()}
					</ul>
				</div>
				{
					showGo
						? (
							<div className="ms-pagination-go-wrap">
								<div className="ms-pagination-go">
									跳转到&nbsp;<input ref="msPaginationGoInput" />&nbsp;页
								</div>
								<div className="ms-paginatioin-btn">
									<button onClick={this.handleGo}>确定</button>
								</div>
							</div>
						)
						: null
				}
			</div>
		);
	}
}

export default Pagination;
