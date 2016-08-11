# reactjs-pagination
> 一个react的本地分页组件

[![version](https://img.shields.io/npm/v/reactjs-pagination.svg?style=flat-square)](http://npm.im/reactjs-pagination)
[![MIT License](https://img.shields.io/npm/l/reactjs-pagination.svg?style=flat-square)](http://opensource.org/licenses/MIT)

reactjs-pagination是一个react的本地分页组件，支持页码、跳转、和迷你模式。

## 使用
```bash
npm install --save reactjs-pagination
```
```js
import React, { Component } from 'react';
import { Pagination }from 'reactjs-pagination';

class Test extends Component {
	state = {
		totalNumber: 326,
		pageSize: 10,
		currentPage: 31
	};
	constructor(props) {
		super(props);
		setTimeout(() => {
			// this.setState({
			// 	currentPage: 15
			// });
			this.setState({
				totalNumber: 125
			});
		}, 3000);
	}
	handleChange = (idx) => {
		console.log('页码改变 => ', idx);
	}
	render() {
		const { totalNumber, pageSize, currentPage } = this.state;

		return (
			<div>
				<Pagination
					totalNumber={totalNumber}
					pageSize={pageSize}
					currentPage={currentPage}
					middlePage={5}
					onChange={this.handleChange}
					showPages
					showGo
				/>
			</div>
		)
	}
}
```
