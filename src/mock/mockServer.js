/*
使用mockjs提供mock数据接口
 */
import Mock from 'mockjs'
import data from './data.json'

// 返回goods的接口
Mock.mock('http://localhost:4000/goods?', 'get', {code: 0, data: data.goods})
// 返回ratings的接口
Mock.mock('http://localhost:4000/ratings?', 'get', {code: 0, data: data.ratings})
// 返回info的接口
Mock.mock('http://localhost:4000/info?', 'get', {code: 0, data: data.info})

// export default ???  不需要向外暴露任何数据, 只需要保存能执行即可
