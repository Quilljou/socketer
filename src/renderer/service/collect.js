import SavedRequest from '../domain/SavedRequest'
import  uuid from 'uuid'

const KEY = 'savedRequest'
const collect = {
  create(savedRequest) {
    savedRequest.id = uuid()
    const lists = this.list()
    lists.push(savedRequest)
    this.save(lists)
  },

  save(lists) {
    try {
      localStorage.setItem(KEY,JSON.stringify(lists))
    } catch (e) {
      console.log(e);
    }
  },

  delete(id) {
    let lists = this.list()
    lists = lists.filter(item => item.id !== id)
    this.save(lists)
  },

  update(savedRequest) {
    let lists = this.list()
    lists = lists.map(item => item.id === savedRequest.id ? savedRequest : item)
    this.save(lists)
  },

  list() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch (e) {
      return []
    }
  },

  getOne(id) {
    let ret;
    this.list().forEach(item => {
      if(item.id === id) ret = item
    })
    return ret
  },

  getKeys() {
    return this.list().map(item => item.id)
  },
}

export default collect
